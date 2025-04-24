const mailService = require("../services/mail.service");

exports.getAdminEmail = (req, res) => {
    mailService.getAdminEmail((error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else {
            return res.status(200).send(data);
        }
    });
}

exports.sendAbonnementMail = async (req, res) => {
    try {
        const sessionId = req.headers['session-id'];
        if (!sessionId) {
            return res.status(401).json({ message: 'Session non fournie ou invalide.' });
        }

        await mailService.envoyerMailAbonnement(sessionId);
        res.status(200).json({ message: 'Email envoyé au gérant avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’envoi de l’email d’abonnement:', error);
        res.status(500).json({ message: 'Erreur lors de l’envoi du mail.' });
    }
};
