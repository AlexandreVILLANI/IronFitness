const activiteService = require("../services/activite.service");

exports.getAllActivite = (req, res) => {
    activiteService.getAllActivite((error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}

exports.getActiviteByID = (req, res) => {
    let id = req.params.id
    activiteService.getActiviteByID(id, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else {
            return res.status(200).send(data);
        }
    });
}

exports.updateActivite = (req, res) => {
    let id = req.body.id_activite
    let nom = req.body.nom_activite
    let image = req.body.image_activite
    let description = req.body.description_activite
    let type = req.body.type_activite
    activiteService.updateActivite(id,nom,image,description,type,(error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}


