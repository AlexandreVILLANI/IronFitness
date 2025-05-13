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

exports.createFormule = (req, res) => {
    const formuleData = req.body;

    // Vérification basique des champs requis
    if (!formuleData.nom_formule || !formuleData.prix_formule || !formuleData.unite || !Array.isArray(formuleData.activites)) {
        return res.status(400).send("Requête invalide : données manquantes ou mal formées.");
    }

    formuleService.createFormule(formuleData, (error, result) => {
        if (error) {
            return res.status(500).send("Erreur interne lors de la création de la formule.");
        } else {
            return res.status(201).send(result); // 201 = Created
        }
    });
};

exports.updateFormule = (req, res) => {
    const id = req.params.id;
    const formuleData = req.body;

    // Validation basique
    if (!formuleData.nom_formule || !formuleData.prix_formule || !formuleData.unite || !Array.isArray(formuleData.activites)) {
        return res.status(400).send("Requête invalide : données manquantes ou mal formées.");
    }

    formuleService.updateFormule(id, formuleData, (error, result) => {
        if (error) {
            return res.status(500).send("Erreur interne lors de la mise à jour de la formule.");
        } else {
            return res.status(200).send(result);
        }
    });
};

exports.deleteFormule = (req, res) => {
    const id = req.params.id;
    formuleService.deleteFormule(id, (error, result) => {
        if (error) {
            if (error.message === 'Formule non trouvée') {
                return res.status(404).send("Formule non trouvée.");
            }
            return res.status(500).send("Erreur interne lors de la suppression de la formule.");
        } else {
            return res.status(200).send(result);
        }
    });
};
