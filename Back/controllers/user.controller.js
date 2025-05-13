const usersService = require("../services/user.service");
const crypto = require("crypto");

exports.getAllUsers = (req, res) => {
    usersService.getAllUsers((error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}

exports.getUserById = (req, res) => {
    let id = req.query.id
    usersService.getUserById(id,(error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}


exports.createUser = (req, res) => {
    let nom = req.body.nom
    let prenom = req.body.prenom
    let mdp = req.body.password
    let mail = req.body.mail
    let id_role = req.body.id_role
    const passwordHash = crypto.createHash("sha256").update(mdp).digest("hex");
    usersService.createUser(nom,prenom,mail,passwordHash,id_role,(error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}


exports.updateUtilisateur = async (req, res) => {
    let nom = req.body.nom_utilisateur
    let prenom = req.body.prenom_utilisateur
    let adresse_mail = req.body.mail_utilisateur
    let password = req.body.password_utilisateur
    let id_utilisateur = req.body.id_utilisateur
    try {
        // Récupère les anciennes informations de l'utilisateur, y compris le mot de passe actuel
        const utilisateur = await usersService.getUtilisateurById(id_utilisateur);
        // Si aucun mot de passe n'est fourni, on garde l'ancien mot de passe
        let passwordHash = utilisateur.mot_de_passe;
        if (password) {
            // Si un nouveau mot de passe est fourni, on le hache
            passwordHash = crypto.createHash("sha256").update(password).digest("hex");
        }
        usersService.updateUtilisateur(nom, prenom, adresse_mail, passwordHash, id_utilisateur, (error, data) => {
            if (error) {
                return res.status(500).send("Internal error");
            }
            else {
                return res.status(200).send(data);
            }
        });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
        return res.status(500).send("Erreur interne");
    }
};


exports.deleteUtilisateur = (req, res) => {
    const id = req.params.id;
    usersService.deleteUtilisateur(id, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        return res.status(200).send(data);
    });
};


exports.getUserBySessionId = (req, res) => {
    const id_session = req.cookies.session
    usersService.getUserBySessionId(id_session, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else {
            return res.status(200).send(data);
        }
    });
}

exports.getUserFormules = (req, res) => {
    const { id_utilisateur } = req.query;
    if (!id_utilisateur) {
        return res.status(400).send("Missing id_utilisateur parameter");
    }

    usersService.getUserFormules(id_utilisateur, (error, data) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Internal server error");
        }

        // ✅ Même si aucune formule trouvée, on renvoie un tableau vide
        return res.status(200).json(data || []);
    });
};




exports.updateUserFormule = (req, res) => {
    const id_utilisateur = req.body.id_utilisateur;
    const formules = req.body.formules; // tableau de id_formule
    if (!id_utilisateur || !formules || !Array.isArray(formules)) {
        return res.status(400).send("Bad Request: id_utilisateur et formules (array) sont requis.");
    }

    usersService.updateUserFormule(id_utilisateur, formules, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else {
            return res.status(200).send(data);
        }
    });
};







