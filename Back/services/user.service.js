const pool = require("../database/db");

const getAllUsers = (callback) => {
    getAllUsersAsync()
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function getAllUsersAsync() {
    try {
        const conn = await pool.connect();
        const result = await conn.query("SELECT u.id_utilisateur, u.nom_utilisateur, u.prenom_utilisateur, u.adresse_mail, STRING_AGG(f.id_formule::TEXT, ', ') AS ids_formules, STRING_AGG(f.nom_formule, ', ') AS noms_formules FROM Utilisateur u LEFT JOIN Formule_Utilisateur fu ON u.id_utilisateur = fu.id_utilisateur LEFT JOIN Formule f ON fu.id_formule = f.id_formule GROUP BY u.id_utilisateur, u.nom_utilisateur, u.prenom_utilisateur, u.adresse_mail");
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getAllUsersAsync:', error);
        throw error;
    }
}

const getUserById = (id,callback)=>{
    getUserByIdAsync(id).
    then(res => {
        callback(null,res);
    }).catch(error => {
        console.log(error);
        callback(error,null)})
}

async function getUserByIdAsync(id) {
    try {
        const conn = await pool.connect();
        const result = await conn.query("SELECT u.id_utilisateur, u.nom_utilisateur, u.prenom_utilisateur, u.adresse_mail, STRING_AGG(f.nom_formule, ', ') AS formules FROM Utilisateur u LEFT JOIN Formule_Utilisateur fu ON u.id_utilisateur = fu.id_utilisateur LEFT JOIN Formule f ON fu.id_formule = f.id_formule WHERE u.id_utilisateur = $1 GROUP BY u.id_utilisateur, u.nom_utilisateur, u.prenom_utilisateur, u.adresse_mail",[id]);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getUserByIdAsync:', error);
        throw error;
    }
}


const createUser = (nom,prenom,mail,mdp,id_role,callback)=>{
    createUserAsync(nom,prenom,mail,mdp,id_role).
    then(res => {
        callback(null,res);
    }).catch(error => {
        console.log(error);
        callback(error,null)})
}

async function createUserAsync(nom,prenom,mail,mdp,id_role) {
    try {
        const conn = await pool.connect();
        const result = await conn.query("INSERT INTO Utilisateur(nom_utilisateur, prenom_utilisateur,adresse_mail,mot_de_passe, id_role) VALUES ($1,$2,$3,$4,$5)",[nom,prenom,mail,mdp,id_role])
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in createUserAsync:', error);
        throw error;
    }
}


const updateUtilisateur = (nom,prenom,adresse_mail,password,id_utilisateur,callback)=>{
    updateUserAsync(nom,prenom,adresse_mail,password,id_utilisateur).
    then(res => {
        callback(null,res);
    }).catch(error => {
        console.log(error);
        callback(error,null)})
}

async function updateUserAsync(nom,prenom,adresse_mail,password,id_utilisateur) {
    try {
        const conn = await pool.connect();
        const result = await conn.query("UPDATE Utilisateur  SET nom_utilisateur=$1, prenom_utilisateur=$2, adresse_mail=$3, mot_de_passe=$4 WHERE id_utilisateur=$5 RETURNING *;",[nom,prenom,adresse_mail,password,id_utilisateur])
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in updateUserAsync:', error);
        throw error;
    }
}



const deleteUtilisateur = (id,callback)=>{
    deleteUserAsync(id).
    then(res => {
        callback(null,res);
    }).catch(error => {
        console.log(error);
        callback(error,null)})
}

async function deleteUserAsync(id) {
    try {
        const conn = await pool.connect();
        await conn.query("DELETE from reservation WHERE id_utilisateur=$1", [id]);
        await conn.query("DELETE from formule_utilisateur WHERE id_utilisateur=$1", [id]);
        await conn.query("DELETE from session WHERE id_utilisateur=$1", [id]);
        const result = await conn.query("DELETE from Utilisateur WHERE id_utilisateur=$1 RETURNING *", [id]);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in deleteUserAsync:', error);
        throw error;
    }
}

const getUserBySessionId = (id_session, callback) => {
    getUserBySessionIdAsync(id_session)
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback('Error in getUserBySessionId', null);
        })
}

async function getUserBySessionIdAsync(id_session) {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT utilisateur.id_utilisateur, adresse_mail, prenom_utilisateur, nom_utilisateur,id_role, id_session, timeLimit FROM Session LEFT JOIN utilisateur ON Session.id_utilisateur = utilisateur.id_utilisateur WHERE id_session = $1;", [id_session]);
        client.release();
        return res.rows[0];
    } catch (error) {
        console.error('Error in getUserBySessionIdAsync:', error);
        throw error;
    }
}


module.exports = {
    getAllUsers: getAllUsers,
    getUserById: getUserById,
    createUser: createUser,
    updateUtilisateur: updateUtilisateur,
    deleteUtilisateur: deleteUtilisateur,
    getUserBySessionId: getUserBySessionId
}
