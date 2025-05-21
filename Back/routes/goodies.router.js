const express = require('express');
const router = express.Router();
const goodiesController = require('../controllers/goodies.controller');

/**
 * @swagger
 * /goodies:
 *   get:
 *     summary: Récupérer tous les goodies avec leurs tailles et disponibilités
 *     tags:
 *       - Goodies
 *     responses:
 *       200:
 *         description: Liste des goodies récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_goodies:
 *                     type: integer
 *                     example: 1
 *                   nom_goodies:
 *                     type: string
 *                     example: T-shirt
 *                   image_goodies:
 *                     type: string
 *                     example: tshirt.jpg
 *                   prix_goodies:
 *                     type: number
 *                     format: float
 *                     example: 14.99
 *                   tailles:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id_taille:
 *                           type: integer
 *                           example: 2
 *                         valeur_taille:
 *                           type: string
 *                           example: M
 *                         disponible:
 *                           type: boolean
 *                           example: true
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', goodiesController.getAllGoodies);

/**
 * @swagger
 * /goodies:
 *   post:
 *     summary: Créer un nouveau goodies avec ses tailles
 *     tags:
 *       - Goodies
 *     requestBody:
 *       description: Données du goodies à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_goodies:
 *                 type: string
 *                 example: Mug
 *               image_goodies:
 *                 type: string
 *                 example: mug.jpg
 *               prix_goodies:
 *                 type: number
 *                 format: float
 *                 example: 9.99
 *               tailles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_taille:
 *                       type: integer
 *                       example: 1
 *                     disponible:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       201:
 *         description: Goodies créé avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', goodiesController.createGoodies);

/**
 * @swagger
 * /goodies/{id}:
 *   put:
 *     summary: Mettre à jour un goodies et ses tailles associées
 *     tags:
 *       - Goodies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du goodies à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Nouvelles données du goodies
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_goodies:
 *                 type: string
 *                 example: T-shirt
 *               image_goodies:
 *                 type: string
 *                 example: tshirt_updated.jpg
 *               prix_goodies:
 *                 type: number
 *                 format: float
 *                 example: 17.99
 *               tailles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_taille:
 *                       type: integer
 *                       example: 1
 *                     disponible:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       200:
 *         description: Goodies mis à jour avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id', goodiesController.updateGoodies);

/**
 * @swagger
 * /goodies/{id}:
 *   delete:
 *     summary: Supprimer un goodies
 *     tags:
 *       - Goodies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du goodies à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Goodies supprimé avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/:id', goodiesController.deleteGoodies);

module.exports = router;
