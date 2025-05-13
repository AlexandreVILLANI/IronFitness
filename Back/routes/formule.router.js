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

/**
 * @swagger
 * /formule/{id}:
 *   get:
 *     summary: Récupérer une formule par son identifiant avec ses activités liées
 *     tags:
 *       - Formules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la formule à récupérer
 *     responses:
 *       200:
 *         description: Formule récupérée avec succès
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
 *                     example: Yoga, Pilates
 *       404:
 *         description: Formule non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', formuleController.getFormuleById);

/**
 * @swagger
 * /formule:
 *   post:
 *     summary: Créer une nouvelle formule avec ses activités associées
 *     tags:
 *       - Formules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom_formule
 *               - prix_formule
 *               - unite
 *               - activites
 *             properties:
 *               nom_formule:
 *                 type: string
 *                 example: Formule Premium
 *               prix_formule:
 *                 type: number
 *                 format: float
 *                 example: 49.99
 *               unite:
 *                 type: string
 *                 example: mois
 *               activites:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3, 5]
 *     responses:
 *       201:
 *         description: Formule créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Formule créée avec succès
 *                 id_formule:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Requête invalide (données manquantes ou incorrectes)
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', formuleController.createFormule);
/**
 * @swagger
 * /formule/{id}:
 *   put:
 *     summary: Mettre à jour une formule et ses activités associées
 *     tags:
 *       - Formules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la formule à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom_formule
 *               - prix_formule
 *               - unite
 *               - activites
 *             properties:
 *               nom_formule:
 *                 type: string
 *                 example: Formule Mise à jour
 *               prix_formule:
 *                 type: number
 *                 format: float
 *                 example: 39.99
 *               unite:
 *                 type: string
 *                 example: mois
 *               activites:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 4]
 *     responses:
 *       200:
 *         description: Formule mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Formule mise à jour avec succès
 *                 id_formule:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id', formuleController.updateFormule);
/**
 * @swagger
 * /formule/{id}:
 *   delete:
 *     summary: Supprimer une formule par son identifiant
 *     tags:
 *       - Formules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la formule à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Formule supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Formule supprimée avec succès
 *       404:
 *         description: Formule non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/:id', formuleController.deleteFormule);



module.exports = router;