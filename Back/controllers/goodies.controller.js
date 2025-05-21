const goodiesService = require("../services/goodies.service");

exports.getAllGoodies = (req, res) => {
    goodiesService.getAllGoodies((error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else {
            return res.status(200).send(data);
        }
    });
};

exports.createGoodies = (req, res) => {
    const goodiesData = req.body;

    goodiesService.createGoodies(goodiesData, (error, result) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else {
            return res.status(201).send(result);
        }
    });
};

exports.updateGoodies = (req, res) => {
    const id_goodies = parseInt(req.params.id);
    const goodiesData = req.body;

    goodiesService.updateGoodies(id_goodies, goodiesData, (error, result) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else {
            return res.status(200).send(result);
        }
    });
};

exports.deleteGoodies = (req, res) => {
    const id_goodies = parseInt(req.params.id);

    goodiesService.deleteGoodies(id_goodies, (error, result) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else {
            return res.status(200).send(result);
        }
    });
};
