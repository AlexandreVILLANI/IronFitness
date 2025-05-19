const express = require('express');
var router = express.Router();
const loginController = require('../controllers/authentification.controller');

/**
 * @swagger
 * /login/cookies:
 *   get:
 *     summary: renvoie une session à partir des cookies
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: Authentification réussie
 *       '401':
 *         description: Échec de l'authentification
 *       '500':
 *         description: Internal error
 */
router.get("/cookies",loginController.getLoginCookiesToken);

/**
 * @swagger
 * /login/logout/{id_utilisateur}:
 *   delete:
 *     summary: Déconnecte un utilisateur en supprimant sa session (base de données et cookie)
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id_utilisateur
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'utilisateur à déconnecter
 *     responses:
 *       '200':
 *         description: Déconnexion réussie
 *       '400':
 *         description: ID utilisateur invalide
 *       '500':
 *         description: Erreur serveur
 */

router.delete('/logout/:id_utilisateur', loginController.logoutByUserId);


/**
 * @swagger
 * /login:
 *   get:
 *     summary: Authentifie un utilisateur avec un mot de passe hashé et renvoie une session
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: Adresse email de l'utilisateur
 *         schema:
 *           type: string
 *           format: email
 *       - in: query
 *         name: password
 *         required: true
 *         description: Mot de passe hashé de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Authentification réussie
 *       '401':
 *         description: Échec de l'authentification
 *       '500':
 *         description: Internal error
 */
router.get("/",loginController.getLoginToken);

/**
 * @swagger
 * /login/without-hash:
 *   get:
 *     summary: Authentifie un utilisateur avec un mot de passe en clair et renvoie une session
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: Adresse email de l'utilisateur
 *         schema:
 *           type: string
 *           format: email
 *       - in: query
 *         name: password
 *         required: true
 *         description: Mot de passe de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Authentification réussie
 *       '401':
 *         description: Échec de l'authentification
 *       '500':
 *         description: Internal error
 */
router.get("/without-hash",loginController.getWithoutHash);


module.exports = router;