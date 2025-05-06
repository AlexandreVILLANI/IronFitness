const formuleService = require("../services/formule.service");

exports.getAllFormule = (req, res) => {
    formuleService.getAllFormule((error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}

exports.getFormuleById = (req, res) => {
    let id = req.params.id
    formuleService.getFormuleById(id,(error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        }
        else {
            return res.status(200).send(data);
        }
    })
}