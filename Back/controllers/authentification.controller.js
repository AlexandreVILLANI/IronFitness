const loginService = require("../services/authentification.service");
const {sha256} = require("pg/lib/crypto/utils-webcrypto");

exports.getLoginToken = (req, res) => {
    const email = req.query.email;
    const passwordHash = req.query.password;
    loginService.getLoginToken(email, passwordHash, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        if (data == null) {
            return res.status(404).send("Échec de l'authentification");
        }
        res.cookie("session", data, {
            maxAge: 2 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return res.status(200).send(data);
    });
};


exports.getLoginCookiesToken = (req, res) => {
    const id_session = req.cookies.session;
    if (id_session==null)
        return res.status(201).send("Pas de session trouvée");
    return res.status(200).send(id_session);
}

exports.logoutByUserId = async (req, res) => {
    const userId = parseInt(req.params.id_utilisateur);
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "ID utilisateur invalide" });
    }
    try {
        await deleteSessionAsync(userId);
        res.clearCookie('session', { httpOnly: true });
        return res.status(200).json({ message: "Déconnexion réussie pour l'utilisateur" });
    } catch (err) {
        console.error('Erreur lors de la déconnexion :', err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
};

// Fonction pour convertir ArrayBuffer en chaîne hexadécimale
function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

exports.getWithoutHash = async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    try {
        // Supposons que sha256 retourne une promesse qui se résout en ArrayBuffer
        const buffer = await sha256(password);
        // Convertir l'ArrayBuffer en chaîne hexadécimale
        const passwordHash = bufferToHex(buffer);

        loginService.getLoginToken(email, passwordHash, (error, data) => {
            if (error) {
                return res.status(500).send("Internal error");
            } else {
                if (data == null)
                    return res.status(404).send("Échec de l'authentification");
                return res.status(200).send(data);
            }
        });
    } catch (error) {
        console.error("Hashing error:", error);
        return res.status(500).send("Internal error during hashing");
    }
}

