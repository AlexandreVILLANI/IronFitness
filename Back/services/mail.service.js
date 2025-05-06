const pool = require("../database/db");
const nodemailer = require("nodemailer");

// Remove all callback-style functions and only keep async versions
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

async function envoyerMailAbonnementAsync(sessionId, id_formule) {
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
            subject: `[Iron Fitness] Demande abonnement - ${formule.nom_formule}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Nouvelle demande d'abonnement</h2>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <h3 style="color: #2980b9; margin-top: 0;">${formule.nom_formule}</h3>
                        <p><strong>Prix :</strong> ${formule.prix_formule} € / ${formule.unite}</p>
                    </div>
                    
                    <h4 style="color: #2c3e50;">Activités incluses :</h4>
                    <ul style="padding-left: 20px;">${activitesHtml}</ul>
                    
                    <h4 style="color: #2c3e50; margin-top: 20px;">Informations client :</h4>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                        <p><strong>Client #${user.id_utilisateur}</strong></p>
                        <p>Prénom : ${user.prenom_utilisateur}</p> 
                        <p>Nom : ${user.nom_utilisateur}</p>
                        <p>Adresse email : ${user.adresse_mail}</p>
                    </div>
                    
                    <p style="margin-top: 20px; color: #7f8c8d;">
                        <small>Cette demande a été générée automatiquement depuis le site Iron Fitness.</small>
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Email envoyé avec succès !');
        return { success: true, message: 'Email envoyé avec succès' };
    } catch (error) {
        console.error('Erreur dans envoyerMailAbonnementAsync:', error);
        throw error;
    }
}

module.exports = {
    getAdminEmailAsync,
    getFormuleCompleteAsync,
    getUserFromSessionAsync,
    envoyerMailAbonnementAsync
};
