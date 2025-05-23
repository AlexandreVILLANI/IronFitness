const express = require('express');
const router = express.Router();
const activiteController = require('../controllers/activite.controller');
const {get} = require("axios");

router.get('/', activiteController.getAllActivite);

/**
 * @swagger
 * /activite:
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
 *                     enum: [Personnel, En groupe]
 *                     example: Sport
 *                   sur_rendezvous:
 *                     type: boolean
 *                     description: Indique si l'activité nécessite un rendez-vous
 *                     example: true
 *       500:
 *         description: Erreur interne du serveur
 */

router.get('/:id', activiteController.getActiviteByID);

/**
 * @swagger
 * /activite/{id}:
 *   get:
 *     summary: Récupérer une activité par son ID
 *     tags:
 *       - Activités
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'activité à récupérer
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Activité récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_activite:
 *                   type: integer
 *                   example: 1
 *                 nom_activite:
 *                   type: string
 *                   example: Match de Foot
 *                 image_activite:
 *                   type: string
 *                   example: foot.jpg
 *                 description_activite:
 *                   type: string
 *                   example: Rencontre amicale au stade municipal.
 *                 type_activite:
 *                   type: string
 *                   enum: [Personnel, En groupe]
 *                   example: Personnel
 *                 sur_rendezvous:
 *                   type: boolean
 *                   description: Indique si l'activité nécessite un rendez-vous
 *                   example: true
 *       404:
 *         description: Activité non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */

router.patch('/updateActivite',activiteController.updateActivite);

/**
 * @swagger
 * /activite/updateActivite:
 *   patch:
 *     summary: Mettre à jour une activité existante
 *     tags:
 *       - Activités
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_activite:
 *                 type: integer
 *                 description: ID de l'activité à mettre à jour
 *                 example: 1
 *               nom_activite:
 *                 type: string
 *                 description: Nouveau nom de l'activité
 *                 example: "Tournoi de tennis"
 *               image_activite:
 *                 type: string
 *                 description: Nouvelle image de l'activité
 *                 example: "tennis.jpg"
 *               description_activite:
 *                 type: string
 *                 description: Nouvelle description de l'activité
 *                 example: "Tournoi amical ouvert à tous"
 *               type_activite:
 *                 type: string
 *                 enum: [Personnel, En groupe]
 *                 description: Type de l'activité
 *                 example: "Personnel"
 *               sur_rendezvous:
 *                 type: boolean
 *                 description: Indique si l'activité nécessite un rendez-vous
 *                 example: true
 *             required:
 *               - id_activite
 *     responses:
 *       200:
 *         description: Activité mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Activité mise à jour avec succès"
 *       400:
 *         description: Données invalides fournies
 *       404:
 *         description: Activité non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */


router.post('/', activiteController.createActivite);
/**
 * @swagger
 * /activite:
 *   post:
 *     summary: Créer une nouvelle activité
 *     tags:
 *       - Activités
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_activite:
 *                 type: string
 *                 description: Nom de la nouvelle activité
 *                 example: "Atelier de poterie"
 *               image_activite:
 *                 type: string
 *                 description: Image de la nouvelle activité
 *                 example: "poterie.jpg"
 *               description_activite:
 *                 type: string
 *                 description: Description de la nouvelle activité
 *                 example: "Venez découvrir l'art de la poterie."
 *               type_activite:
 *                 type: string
 *                 enum: [Personnel, En groupe]
 *                 description: Type de la nouvelle activité
 *                 example: "Personnel"
 *               sur_rendezvous:
 *                 type: boolean
 *                 description: Indique si l'activité nécessite un rendez-vous
 *                 example: false
 *             required:
 *               - nom_activite
 *               - type_activite
 *               - sur_rendezvous
 *     responses:
 *       201:
 *         description: Activité créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_activite:
 *                   type: integer
 *                   description: ID de la nouvelle activité créée
 *                   example: 5
 *       400:
 *         description: Données invalides fournies
 *       500:
 *         description: Erreur interne du serveur
 */

router.delete('/:id', activiteController.deleteActivite);

/**
 * @swagger
 * /activite/{id}:
 *   delete:
 *     summary: Supprimer une activité par son ID
 *     tags:
 *       - Activités
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'activité à supprimer
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Activité supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Activité 1 supprimée avec succès"
 *       404:
 *         description: Activité non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */


module.exports = router;