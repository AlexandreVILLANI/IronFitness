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


exports.updateUtilisateur = (req, res) => {
    let nom = req.body.nom
    let prenom = req.body.prenom
    let adresse_mail = req.body.mail
    let password = req.body.password
    let id_utilisateur = req.body.id_utilisateur
    let passwordHash = password ? crypto.createHash("sha256").update(password).digest("hex") : null;
    usersService.updateUtilisateur(nom,prenom,adresse_mail,passwordHash,id_utilisateur,(error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}


exports.deleteUtilisateur = (req, res) => {
    const id = req.body.id;
    usersService.deleteUtilisateur(id, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        return res.status(200).send(data);
    });
};


exports.getUserBySessionId = (req, res) => {
    const session_id = req.cookies.session
    usersService.getUserBySessionId(session_id, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else {
            return res.status(200).send(data);
        }
    });
}






