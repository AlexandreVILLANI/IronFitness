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