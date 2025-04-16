const express = require('express');
const router = express.Router();
const activiteController = require('../controllers/activite.controller');

/**
 * @swagger
 * /api/activites:
 *   get:
 *     summary: Récupérer toutes les activités
 *     tags:
 *       - Activités
 *     responses:
 *       200:
 *         description: Liste des activités récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_activite:
 *                     type: integer
 *                     example: 1
 *                   nom_activite:
 *                     type: string
 *                     example: Match de Foot
 *                   image_activite:
 *                     type: string
 *                     example: foot.jpg
 *                   description_activite:
 *                     type: string
 *                     example: Rencontre amicale au stade municipal.
 *                   type_activite:
 *                     type: string
 *                     enum: [Culture, Loisir, Concert, Sport, Restauration]
 *                     example: Sport
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/activites', activiteController.getAllActivite);

module.exports = router;
