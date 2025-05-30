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
    let sur_rendezvous = req.body.sur_rendezvous
    activiteService.updateActivite(id,nom,image,description,type,sur_rendezvous,(error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}

exports.createActivite = (req, res) => {
    const activiteData = req.body;
    activiteService.createActivite(activiteData, (error, data) => {
        if (error) {
            return res.status(500).send("Internal server error during activity creation");
        } else {
            return res.status(201).send(data);
        }
    });
};

exports.deleteActivite = (req, res) => {
    const activiteId = req.params.id;
    activiteService.deleteActivite(activiteId, (error, data) => {
        if (error) {
            return res.status(500).send("Internal server error during activity deletion");
        } else {
            if (data > 0) {
                return res.status(200).send({ message: `Activity ${activiteId} deleted successfully` });
            } else {
                return res.status(404).send({ message: `Activity ${activiteId} not found` });
            }
        }
    });
};



