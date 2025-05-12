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
    let places_disponibles = req.body.places_disponibles
    creneauService.updateCreneau(id_creneau,id_activite,date_activite,heure_debut,heure_fin,places_disponibles,(error, data) => {
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
    let places_disponibles = req.body.places_disponibles
    creneauService.createCreneau(id_activite,date_activite,heure_debut,heure_fin,places_disponibles,(error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}

exports.deleteCreneau = (req, res) => {
    const idCreneau = req.params.id;
    if (!idCreneau) {
        return res.status(400).send("L'id du créneau est requis");
    }
    creneauService.deleteCreneau(idCreneau, (error, result) => {
        if (error) {
            return res.status(500).send("Erreur lors de la suppression du créneau");
        } else {
            return res.status(200).send({ message: "Créneau supprimé avec succès", id: idCreneau });
        }
    });
};


