const express = require('express');
let router = express.Router();
const creneauController = require('../controllers/creneau.controller');

/**
 * @swagger
 * tags:
 *   name: Créneaux
 *   description: Gestion des créneaux horaires pour les activités
 */

/**
 * @swagger
 * /creneau:
 *   get:
 *     summary: Récupère tous les créneaux
 *     tags: [Créneaux]
 *     responses:
 *       200:
 *         description: Liste des créneaux récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Creneau'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', creneauController.getAllCreneau);

/**
 * @swagger
 * /creneau/{id}:
 *   get:
 *     summary: Récupère un créneau par son ID
 *     tags: [Créneaux]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du créneau
 *     responses:
 *       200:
 *         description: Créneau récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Creneau'
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', creneauController.getCreneauById);

/**
 * @swagger
 * /creneau:
 *   post:
 *     summary: Crée un nouveau créneau
 *     tags: [Créneaux]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreneauInput'
 *     responses:
 *       200:
 *         description: Créneau créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Creneau'
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', creneauController.createCreneau);

/**
 * @swagger
 * /creneau:
 *   put:
 *     summary: Met à jour un créneau existant
 *     tags: [Créneaux]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreneauUpdate'
 *     responses:
 *       200:
 *         description: Créneau mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Creneau'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input data"
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/', creneauController.updateCreneau);

/**
 * @swagger
 * components:
 *   schemas:
 *     Creneau:
 *       type: object
 *       properties:
 *         id_creneau:
 *           type: integer
 *           description: ID du créneau
 *         id_activite:
 *           type: integer
 *           description: ID de l'activité associée
 *         date_activite:
 *           type: string
 *           format: date
 *           description: Date de l'activité (YYYY-MM-DD)
 *         heure_debut:
 *           type: string
 *           format: time
 *           description: Heure de début (HH:MM:SS)
 *         heure_fin:
 *           type: string
 *           format: time
 *           description: Heure de fin (HH:MM:SS)
 *         places_disponibles:
 *           type: integer
 *           description: Nombre de places disponibles
 *       example:
 *         id_creneau: 1
 *         id_activite: 3
 *         date_activite: "2023-12-15"
 *         heure_debut: "09:00:00"
 *         heure_fin: "10:30:00"
 *         places_disponibles: 15
 *
 *     CreneauInput:
 *       type: object
 *       required:
 *         - id_activite
 *         - date_activite
 *         - heure_debut
 *         - heure_fin
 *         - places_disponibles
 *       properties:
 *         id_activite:
 *           type: integer
 *         date_activite:
 *           type: string
 *           format: date
 *         heure_debut:
 *           type: string
 *           format: time
 *         heure_fin:
 *           type: string
 *           format: time
 *         places_disponibles:
 *           type: integer
 *       example:
 *         id_activite: 3
 *         date_activite: "2023-12-15"
 *         heure_debut: "09:00:00"
 *         heure_fin: "10:30:00"
 *         places_disponibles: 15
 *
 *     CreneauUpdate:
 *       allOf:
 *         - $ref: '#/components/schemas/CreneauInput'
 *         - type: object
 *           required:
 *             - id_creneau
 *           properties:
 *             id_creneau:
 *               type: integer
 *           example:
 *             id_creneau: 1
 */
router.delete('/:id', creneauController.deleteCreneau);

/**
 * @swagger
 * /creneau/{id}:
 *   delete:
 *     summary: Supprime un créneau par son ID
 *     tags: [Créneaux]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du créneau à supprimer
 *     responses:
 *       200:
 *         description: Créneau supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Créneau supprimé avec succès"
 *                 id:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: ID manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "L'id du créneau est requis"
 *       500:
 *         description: Erreur interne du serveur
 */

module.exports = router;


