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

exports.getGoodieById = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).send("Invalid goodie ID");
    }

    goodiesService.getGoodieById(id, (error, data) => {
        if (error) {
            return res.status(500).send("Internal error");
        } else if (!data) {
            return res.status(404).send("Goodie not found");
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

exports.updateGoodies = async (req, res) => {
    const id_goodies = parseInt(req.params.id);
    const goodiesData = req.body;
    try {
        const result = await goodiesService.updateGoodies(id_goodies, goodiesData);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).send("Internal error");
    }
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
