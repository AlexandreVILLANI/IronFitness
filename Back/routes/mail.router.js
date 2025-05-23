const express = require('express');
let router = express.Router();
const mailController = require('../controllers/mail.controller');

router.get("/getAdminEmail", mailController.getAdminEmail);

/**
 * @swagger
 * tags:
 *   name: Mail
 *   description: Gestion des opérations liées aux emails
 */

/**
 * @swagger
 * /mail/getAdminEmail:
 *   get:
 *     tags: [Mail]
 *     summary: Récupère l'adresse email de l'administrateur
 *     description: >
 *       Cette endpoint permet de récupérer l'adresse email de l'utilisateur
 *       ayant le rôle administrateur (id_role = 2).
 *       Utile pour les communications administratives.
 *     operationId: getAdminEmail
 *     responses:
 *       200:
 *         description: Succès - Email administrateur retourné
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminEmail'
 *       401:
 *         description: Non autorisé - Authentification requise
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé - Droits insuffisants
 *       404:
 *         description: Administrateur non trouvé
 *       500:
 *         description: Erreur serveur interne
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post("/abonnement-mail", mailController.envoyerMailAbonnement);

/**
 * @swagger
 * /mail/abonnement-mail:
 *   post:
 *     tags: [Mail]
 *     summary: Envoie une demande d'abonnement à l'administrateur
 *     description: >
 *       Cette route envoie un email détaillé à l'administrateur avec les informations
 *       de la formule demandée, ses activités associées et les informations de l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idFormule
 *             properties:
 *               idFormule:
 *                 type: integer
 *                 description: ID de la formule demandée
 *                 example: 5
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de session valide obtenu à la connexion de l'utilisateur
 *     responses:
 *       200:
 *         description: Demande d'abonnement envoyée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Demande d'abonnement envoyée au gérant avec succès."
 *       400:
 *         description: Données manquantes ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Session manquante ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ressource non trouvée (utilisateur, formule ou admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur lors de l'envoi de l'email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post("/commander-goodie", mailController.envoyerMailGoodie);

/**
 * @swagger
 * /mail/commander-goodie:
 *   post:
 *     tags: [Mail]
 *     summary: Envoie une notification de commande de goodie à l'administrateur
 *     description: >
 *       Cette route envoie un email détaillé à l'administrateur avec les informations
 *       du goodie commandé, la quantité, la taille sélectionnée et les informations de l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_goodie
 *               - quantite
 *               - id_taille
 *             properties:
 *               id_goodie:
 *                 type: integer
 *                 description: ID du goodie commandé
 *                 example: 12
 *               quantite:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantité commandée
 *                 example: 2
 *               id_taille:
 *                 type: integer
 *                 description: ID de la taille sélectionnée
 *                 example: 3
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de session valide obtenu à la connexion de l'utilisateur
 *     responses:
 *       200:
 *         description: Notification de commande envoyée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Notification de commande envoyée au gérant avec succès."
 *       400:
 *         description: Données manquantes ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Session manquante ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ressource non trouvée (utilisateur, goodie, taille ou admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur lors de l'envoi de l'email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = router;