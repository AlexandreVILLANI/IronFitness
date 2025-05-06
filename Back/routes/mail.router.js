const express = require('express');
let router = express.Router();
const mailController = require('../controllers/mail.controller');

router.get("/getAdminEmail", mailController.getAdminEmail);

/**
 * @swagger
 * tags:
 *   name: Mail
 *   description: Gestion des opérations liées aux emails
 *
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
 *
 * components:
 *   schemas:
 *     AdminEmail:
 *       type: object
 *       properties:
 *         adresse_mail:
 *           type: string
 *           format: email
 *           description: Email de l'administrateur
 *           example: admin@fitness-club.com
 *       required:
 *         - adresse_mail
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Message d'erreur
 *           example: "Une erreur est survenue lors de la récupération de l'email"
 *         details:
 *           type: string
 *           description: Détails techniques de l'erreur (optionnel)
 *           example: "Database connection failed"
 *       required:
 *         - error
 *
 * securityDefinitions:
 *   bearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *     description: JWT token pour l'authentification
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
 *
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Message d'erreur détaillé
 *           example: "Email de l'administrateur introuvable."
 */



module.exports = router;