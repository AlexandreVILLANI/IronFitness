const pool = require("../database/db");
const nodemailer = require("nodemailer");

async function getAdminEmailAsync() {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT adresse_mail FROM utilisateur WHERE id_role = 2 LIMIT 1;");
        client.release();
        return res.rows[0];
    } catch (error) {
        console.error('Error in getAdminEmailAsync:', error);
        throw error;
    }
}

async function getFormuleCompleteAsync(idFormule) {
    try {
        const conn = await pool.connect();
        const formuleQuery = 'SELECT * FROM Formule WHERE id_formule = $1';
        const formuleRes = await conn.query(formuleQuery, [idFormule]);
        const activitesQuery = `
            SELECT a.* FROM Activite a
                                JOIN Formule_Activite fa ON a.id_activite = fa.id_activite
            WHERE fa.id_formule = $1
        `;
        const activitesRes = await conn.query(activitesQuery, [idFormule]);
        conn.release();
        if (!formuleRes.rows[0]) return null;
        return {...formuleRes.rows[0], activites: activitesRes.rows};
    } catch (error) {
        console.error('Error in getFormuleCompleteAsync:', error);
        throw error;
    }
}

async function getUserFromSessionAsync(sessionId) {

    try {
        const client = await pool.connect();
        const res = await client.query(
            "SELECT u.id_utilisateur, u.nom_utilisateur, u.prenom_utilisateur, u.adresse_mail FROM utilisateur u JOIN session s ON u.id_utilisateur = s.id_utilisateur WHERE s.id_session = $1;",
            [sessionId]
        );
        client.release();
        return res.rows[0];
    } catch (error) {
        console.error('Error in getUserFromSessionAsync:', error);
        throw error;
    }
}

async function envoyerMailAbonnementAsync(sessionId, id_formule, demandeDescription = null) {
    try {
        const user = await getUserFromSessionAsync(sessionId);
        if (!user) {
            throw new Error("Utilisateur non trouvé.");
        }

        const formule = await getFormuleCompleteAsync(id_formule);
        if (!formule) {
            throw new Error("Formule non trouvée.");
        }

        const admin = await getAdminEmailAsync();
        if (!admin?.adresse_mail) {
            throw new Error("Email de l'administrateur introuvable.");
        }

        const activitesHtml = formule.activites.map(a => `
            <li>
                <strong>${a.nom_activite}</strong> <br>
            </li>
        `).join('');

        // Section rendez-vous conditionnelle
        const rendezVousSection = formule.sur_rendezvous ? `
            <h4 style="color: #e67e22; margin-top: 20px;">🔔 Demande de rendez-vous personnalisé</h4>
            <div style="background: #fff8e1; padding: 15px; border-radius: 5px; border-left: 4px solid #e67e22;">
                <p><strong>Description de la demande :</strong></p>
                <p style="font-style: italic; white-space: pre-wrap;">${demandeDescription || 'Aucune description fournie'}</p>
            </div>
        ` : '';

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ironfitnesscontacts@gmail.com',
                pass: 'kmvm biek pzbp xbht'
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: admin.adresse_mail,
            subject: `[Iron Fitness] ${formule.sur_rendezvous ? 'Demande RDV' : 'Demande abonnement'} - ${formule.nom_formule}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Nouvelle ${formule.sur_rendezvous ? 'demande de rendez-vous' : 'demande d\'abonnement'}</h2>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <h3 style="color: #2980b9; margin-top: 0;">${formule.nom_formule}</h3>
                        <p><strong>Prix :</strong> ${formule.prix_formule} € / ${formule.unite}</p>
                        <p><strong>Type :</strong> ${formule.sur_rendezvous ? 'Sur rendez-vous' : 'Abonnement standard'}</p>
                    </div>
                    
                    <h4 style="color: #2c3e50;">Activités incluses :</h4>
                    <ul style="padding-left: 20px;">${activitesHtml}</ul>
                    
                    ${rendezVousSection}
                    
                    <h4 style="color: #2c3e50; margin-top: 20px;">Informations client :</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                        <p><strong>Client #${user.id_utilisateur}</strong></p>
                        <p>Prénom : ${user.prenom_utilisateur}</p> 
                        <p>Nom : ${user.nom_utilisateur}</p>
                        <p>Adresse email : ${user.adresse_mail}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 15px; background: #e8f5e9; border-radius: 5px; text-align: center;">
                        <p><strong>${formule.sur_rendezvous ? 'Action requise :' : 'Prochaines étapes :'}</strong></p>
                        <p>${formule.sur_rendezvous
                ? 'Veuillez contacter le client pour planifier un rendez-vous'
                : 'Veuillez confirmer l\'abonnement avec le client'}</p>
                    </div>
                    
                    <p style="margin-top: 20px; color: #7f8c8d;">
                        <small>Cette demande a été générée automatiquement depuis le site Iron Fitness.</small>
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        //console.log('Email envoyé avec succès !');
        return { success: true, message: 'Email envoyé avec succès' };
    } catch (error) {
        console.error('Erreur dans envoyerMailAbonnementAsync:', error);
        throw error;
    }
}
const getGoodieById = (id, callback) => {
    getGoodieByIdAsync(id)
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
};

async function getGoodieByIdAsync(id) {
    try {
        const conn = await pool.connect();
        const query = `
            SELECT
                g.id_goodies,
                g.nom_goodies,
                g.image_goodies,
                g.prix_goodies,
                STRING_AGG(
                    CONCAT(t.id_taille, ':', t.valeur_taille, ':', tg.quantite_stock),
                    ',' ORDER BY t.id_taille
                ) AS tailles
            FROM
                Goodies g
                LEFT JOIN Taille_goodies tg ON g.id_goodies = tg.id_goodies
                LEFT JOIN Taille t ON tg.id_taille = t.id_taille
            WHERE
                g.id_goodies = $1
            GROUP BY
                g.id_goodies, g.nom_goodies, g.image_goodies, g.prix_goodies
        `;
        const result = await conn.query(query, [id]);
        conn.release();

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        let tailles = [];
        if (row.tailles) {
            tailles = row.tailles.split(',').map(str => {
                const [id_taille, valeur_taille, quantite_stock] = str.split(':');
                return {
                    id_taille: parseInt(id_taille),
                    valeur_taille,
                    quantite_stock
                };
            });
        }

        return {
            id_goodies: row.id_goodies,
            nom_goodies: row.nom_goodies,
            image_goodies: row.image_goodies,
            prix_goodies: row.prix_goodies,
            tailles
        };
    } catch (error) {
        console.error('Error in getGoodieByIdAsync:', error);
        throw error;
    }
}
async function envoyerMailGoodieAsync(sessionId, id_goodie, quantite, id_taille) {
    try {
        // Récupérer les informations de l'utilisateur
        const user = await getUserFromSessionAsync(sessionId);
        if (!user) {
            throw new Error("Utilisateur non trouvé.");
        }

        // Récupérer les informations du goodie
        const goodie = await getGoodieByIdAsync(id_goodie);
        if (!goodie) {
            throw new Error("Goodie non trouvé.");
        }

        // Récupérer l'email de l'admin
        const admin = await getAdminEmailAsync();
        if (!admin?.adresse_mail) {
            throw new Error("Email de l'administrateur introuvable.");
        }

        // Trouver la taille sélectionnée
        const tailleSelectionnee = goodie.tailles.find(t => t.id_taille === id_taille);
        if (!tailleSelectionnee) {
            throw new Error("Taille sélectionnée non disponible pour ce goodie.");
        }

        // Vérifier si la taille est en stock
        if (tailleSelectionnee.quantite_stock !== 't' && tailleSelectionnee.quantite_stock !== true) {
            throw new Error("La taille sélectionnée n'est plus disponible en stock.");
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ironfitnesscontacts@gmail.com',
                pass: 'kmvm biek pzbp xbht'
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: admin.adresse_mail,
            subject: `[Iron Fitness] Nouvelle commande de goodie - ${goodie.nom_goodies}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Nouvelle commande de goodie</h2>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <h3 style="color: #2980b9; margin-top: 0;">${goodie.nom_goodies}</h3>
                        <p><strong>Prix unitaire :</strong> ${goodie.prix_goodies} €</p>
                        <p><strong>Quantité :</strong> ${quantite}</p>
                        <p><strong>Prix total :</strong> ${(goodie.prix_goodies * quantite).toFixed(2)} €</p>
                        <p><strong>Taille sélectionnée :</strong> ${tailleSelectionnee.valeur_taille}</p>
                    </div>
                    
                    <h4 style="color: #2c3e50; margin-top: 20px;">Informations client :</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                        <p><strong>Client #${user.id_utilisateur}</strong></p>
                        <p>Prénom : ${user.prenom_utilisateur}</p> 
                        <p>Nom : ${user.nom_utilisateur}</p>
                        <p>Adresse email : ${user.adresse_mail}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 15px; background: #e8f5e9; border-radius: 5px; text-align: center;">
                        <p><strong>Action requise :</strong></p>
                        <p>Veuillez préparer la commande et contacter le client pour la livraison</p>
                    </div>
                    
                    <p style="margin-top: 20px; color: #7f8c8d;">
                        <small>Cette commande a été générée automatiquement depuis le site Iron Fitness.</small>
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email de commande envoyé avec succès' };
    } catch (error) {
        console.error('Erreur dans envoyerMailGoodieAsync:', error);
        throw error;
    }
}
module.exports = {
    getAdminEmailAsync,
    getFormuleCompleteAsync,
    getUserFromSessionAsync,
    envoyerMailAbonnementAsync,
    envoyerMailGoodieAsync
};
