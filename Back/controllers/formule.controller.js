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