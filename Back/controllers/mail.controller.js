const mailService = require("../services/mail.service");

exports.getAdminEmail = async (req, res) => {
    try {
        const adminEmail = await mailService.getAdminEmailAsync();
        return res.status(200).json(adminEmail);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

exports.getFormuleComplete = async (req, res) => {
    try {
        const { idFormule } = req.params;
        const formule = await mailService.getFormuleCompleteAsync(idFormule);
        if (!formule) {
            return res.status(404).send("Formule non trouvée");
        }
        return res.status(200).json(formule);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erreur interne du serveur");
    }
};

exports.envoyerMailAbonnement = async (req, res) => {
    try {
        const sessionId = req.headers['session-id'];
        const { id_formule, demande_description } = req.body;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Aucune session trouvée. Veuillez vous connecter."
            });
        }

        if (!id_formule) {
            return res.status(400).json({
                success: false,
                message: "ID de formule manquant dans la requête"
            });
        }

        const result = await mailService.envoyerMailAbonnementAsync(sessionId, id_formule, demande_description);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        return res.status(500).json({
            success: false,
            message: "Erreur interne, l'email n'a pas pu être envoyé",
            error: error.message
        });
    }
};

exports.envoyerMailGoodie = async (req, res) => {
    try {
        const sessionId = req.headers['session-id'];
        const { id_goodie, quantite, id_taille } = req.body;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: "Aucune session trouvée. Veuillez vous connecter."
            });
        }

        if (!id_goodie || !id_taille) {
            return res.status(400).json({
                success: false,
                message: "ID du goodie ou de la taille manquant dans la requête"
            });
        }

        if (!quantite || quantite <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantité invalide ou manquante"
            });
        }

        const result = await mailService.envoyerMailGoodieAsync(sessionId, id_goodie, quantite, id_taille);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Erreur interne, l'email de commande n'a pas pu être envoyé"
        });
    }
};