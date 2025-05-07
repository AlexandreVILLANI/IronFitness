const creneauService = require("../services/creneau.service");

exports.getAllCreneau = (req, res) => {
    creneauService.getAllCreneau((error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}

exports.getCreneauById = (req, res) => {
    let id = req.params.id
    creneauService.getCreneauById(id, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else {
            return res.status(200).send(data);
        }
    });
}

exports.updateCreneau = (req, res) => {
    let id_creneau = req.body.id_creneau
    let id_activite = req.body.id_activite
    let date_activite = req.body.date_activite
    let heure_debut = req.body.heure_debut
    let heure_fin = req.body.heure_fin
    let place_dispo = req.body.place_dispo
    creneauService.updateCreneau(id_creneau,id_activite,date_activite,heure_debut,heure_fin,place_dispo,(error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}

exports.createCreneau = (req, res) => {
    let id_activite = req.body.id_activite
    let date_activite = req.body.date_activite
    let heure_debut = req.body.heure_debut
    let heure_fin = req.body.heure_fin
    let place_dispo = req.body.place_dispo
    creneauService.createCreneau(id_activite,date_activite,heure_debut,heure_fin,place_dispo,(error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}

