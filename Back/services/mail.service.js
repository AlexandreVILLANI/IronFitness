const pool = require("../database/db");
const nodemailer = require("nodemailer");
const authService = require('../services/authentification.service');


const getAdminEmail = ( callback) => {
    getAdminEmailAsync()
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback('Error in getUserBySessionId', null);
        })
}
// Fonction pour récupérer l'utilisateur courant (via la session)
async function getUserFromSession(sessionId) {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT u.id_utilisateur,u.nom_utilisateur, u.prenom_utilisateur, u.adresse_mail FROM utilisateur u JOIN session s ON u.id_utilisateur = s.id_utilisateur WHERE s.id_session = $1;", [sessionId]);
        client.release();
        return res.rows[0];  // Retourne les informations de l'utilisateur connecté
    } catch (error) {
        console.error('Error in getUserFromSession:', error);
        throw error;
    }
}

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

async function envoyerMailAbonnement(sessionId) {
    // Récupérer les infos de l'utilisateur connecté via la session
    const user = await getUserFromSession(sessionId);
    if (!user) {
        throw new Error("Utilisateur non trouvé.");
    }

    const admin = await getAdminEmailAsync();
    if (!admin || !admin.adresse_mail) {
        throw new Error("Email de l'administrateur introuvable.");
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ironfitnesscontacts@gmail.com', // Ton adresse Gmail
            pass: 'kmvm biek pzbp xbht' // Ton mot de passe d'application
        }
    });

    const mailOptions = {
        from: 'ironfitnesscontacts@gmail.com',
        to: admin.adresse_mail,
        subject: 'Nouvelle demande d’abonnement',
        html: `
            <h2>Nouvelle demande d’abonnement</h2>
            <p><strong>Id de l'utilisateur:</strong> ${user.id_utilisateur}</p>
            <p><strong>Nom :</strong> ${user.nom_utilisateur}</p>
            <p><strong>Prénom :</strong> ${user.prenom_utilisateur}</p>
            <p><strong>Email :</strong> ${user.adresse_mail}</p>
        `
    };
    await transporter.sendMail(mailOptions);
    console.log('email envoyé avec succès')
    console.log('id_utilisateur :',user.id_utilisateur)
    console.log('nom_utilisateur :',user.nom_utilisateur)
    console.log('prenom_utilisateur:',user.prenom_utilisateur)
    console.log('adresse_mail :',user.adresse_mail)

}
module.exports = {
    getAdminEmail: getAdminEmail,
    envoyerMailAbonnement
}
