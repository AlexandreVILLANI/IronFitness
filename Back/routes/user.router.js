const express = require('express');
let router = express.Router();
const usersController = require('../controllers/user.controller');
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id_utilisateur:
 *           type: int
 *           example: "13"
 *         nom:
 *           type: string
 *           example: "Smith"
 *         prenom:
 *           type: string
 *           example: "John"
 *         adresse_mail:
 *           type: string
 *           example: "johnsmith@gmail.com"
 *         mot_de_passe:
 *           type: string
 *           example: "bananeFlambée"
 *         id_role:
 *           type: integer
 *           example: 1
 *
 *     UserD:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *
 *     UserActivites:
 *       type: object
 *       properties:
 *         prix_activite:
 *           type: number
 *           example: 40
 *         type_concert:
 *           type: string
 *           example : "METAL"
 *         id_activite:
 *           type: int
 *           example: 7
 *         type_activite:
 *           type: string
 *           example: "Sport"
 *         nom_activite:
 *           type: string
 *           example: "VTT"
 *         images_activite:
 *           type: string
 *           example: "vtt.jpg"
 *         description_activite:
 *           type: string
 *           example: "Pratique du vélo tout-terrain sur des chemins variés."
 *
 *     UserCr:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           example: "John"
 *         prenom:
 *           type: string
 *           example: "Smith"
 *         mail:
 *           type: string
 *           example: "John.Smith@gmail.com"
 *         password:
 *           type: string
 *           example: "bananeFlambée"
 *         id_role:
 *           type: integer
 *           example: 2
 *
 *     UserU:
 *       type: object
 *       properties:
 *         id_utilisateur:
 *           type: int
 *           example: 1
 *         nom:
 *           type: string
 *           example: "Dupont"
 *         prenom:
 *           type: string
 *           example: "Jean"
 *         mail:
 *           type: string
 *           example: "jean.dupont@gmail.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         id_role:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */


router.get("/",usersController.getAllUsers);
/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *        description: Internal error
 */

router.get("/byid", usersController.getUserById);
/**
 * @swagger
 * /users/byid:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - name: id
 *         in: query
 *         description: "L'identifiant unique de l'utilisateur"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */


router.post("/",usersController.createUser);

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCr'
 *     responses:
 *       200:
 *         description: User created successfully
 *       500:
 *         description: Internal error
 */

router.patch("/",usersController.updateUtilisateur);

/**
 * @swagger
 * /users:
 *   patch:
 *     tags: [Users]
 *     summary: Update a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserU'
 *     responses:
 *       200:
 *         description: User created successfully
 *       500:
 *         description: Internal error
 */




router.delete("/delete/:id", usersController.deleteUtilisateur);

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by its ID.
 *     description: Deletes a user from the system using their unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

router.get("/getBySessionId", usersController.getUserBySessionId);

/**
 * @swagger
 * /users/getBySessionId:
 *   get:
 *     summary: Get activity details by ID
 *     tags: [Users]
 *     description: Retrieves the details of an activity, including its view count, by its ID.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: The ID of the activity.
 *         required: true
 *         schema:
 *           type: string
 *           example: 289d6898-89f8-42fe-a2eb-6596e245e6e4
 *     responses:
 *       200:
 *         description: Activity details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_activite:
 *                     type: integer
 *                     example: 7
 *                   type_activite:
 *                     type: string
 *                     example: "Outdoor"
 *                   nom_activite:
 *                     type: string
 *                     example: "Mountain Hiking"
 *                   id_prestataire:
 *                     type: integer
 *                     example: 12
 *                   vue_activite:
 *                     type: integer
 *                     example: 150
 *       400:
 *         description: Bad request, invalid or missing parameters
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Internal server error
 */
router.get('/getUserFormule', usersController.getUserFormules);

/**
 * @swagger
 * /users/getUserFormule:
 *   get:
 *     summary: Get all formules associated with a user
 *     tags: [Users]
 *     description: Retrieves all the formules linked to a specific user by their ID.
 *     parameters:
 *       - name: id_utilisateur
 *         in: query
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: List of formules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_formule:
 *                     type: integer
 *                     example: 2
 *                   nom_formule:
 *                     type: string
 *                     example: "Abonnement Mensuel"
 *                   prix_formule:
 *                     type: number
 *                     format: float
 *                     example: 49.99
 *                   unite:
 *                     type: string
 *                     example: "mois"
 *       400:
 *         description: Missing or invalid id_utilisateur parameter
 *       404:
 *         description: No formules found for the specified user
 *       500:
 *         description: Internal server error
 */


router.patch('/updateUserFormule',usersController.addFormuleToUser);

/**
 * @swagger
 * /users/updateUserFormule:
 *   patch:
 *     summary: Add formules to a user
 *     tags: [Users]
 *     description: Assigns one or multiple formules to a user based on their user ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_utilisateur
 *               - formules
 *             properties:
 *               id_utilisateur:
 *                 type: integer
 *                 example: 5
 *                 description: The ID of the user.
 *               formules:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   example: 2
 *                 description: An array of formule IDs to assign to the user.
 *     responses:
 *       200:
 *         description: Formules successfully assigned to the user
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
 *                   example: "Formules ajoutées avec succès"
 *       400:
 *         description: Bad request, missing or invalid parameters
 *       500:
 *         description: Internal server error
 */



module.exports = router;