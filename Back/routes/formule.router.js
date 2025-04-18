const express = require('express');
const router = express.Router();
const formuleController = require('../controllers/formule.controller');
const { get } = require("axios");

/**
 * @swagger
 * /formule:
 *   get:
 *     summary: Récupérer toutes les formules avec leurs activités liées
 *     tags:
 *       - Formules
 *     responses:
 *       200:
 *         description: Liste des formules et de leurs activités liées récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_formule:
 *                     type: integer
 *                     example: 1
 *                   nom_formule:
 *                     type: string
 *                     example: Formule Découverte
 *                   prix_formule:
 *                     type: number
 *                     format: float
 *                     example: 29.99
 *                   unite:
 *                     type: string
 *                     example: mois
 *                   activites_liees:
 *                     type: string
 *                     description: Noms des activités liées à la formule, séparés par des virgules
 *                     example: Yoga, Pilates
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', formuleController.getAllFormule);

module.exports = router;