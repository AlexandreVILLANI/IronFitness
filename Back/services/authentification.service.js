const pool = require("../database/db")
const { v4: uuidv4 } = require('uuid');

const getLoginToken = (email,password,callback) => {
    getSessionTokenAsync(email,password)
        .then(res=>{
            callback(null,res);
        })
        .catch(error=>{
            callback(error,null);
        })
}

async function getSessionTokenAsync(email, password) {
    try {
        userId = await getUserIdAsync(email,password)
        if(userId == null) {
            return null;
        }
        await deleteSessionAsync(userId);
        uuid = await createSessionAsync(userId);
        return uuid;
    } catch (error) {
        console.error('Error in getLoginToken:', error);
        throw error;
    }
}

async function createSessionAsync(userId){
    const conn = await pool.connect();
    const uuid = uuidv4();
    await conn.query('INSERT INTO Session(id_session, id_utilisateur, timeLimit) ' +
        'VALUES($1,$2,CURRENT_TIMESTAMP+INTERVAL \'1 hour\');', [uuid,userId]);
    conn.release();
    return uuid;
}

async function deleteSessionAsync(userId){
    console.log('caca')
    const conn = await pool.connect();
    await conn.query('DELETE FROM Session WHERE id_utilisateur = $1;',[userId]);
    conn.release();
}//pas utile en vrai, marche pas pour l'instant, j'ai pas vérifier mais le swagger ne doit pas avoir le paramètre du uuid (raison du problème)

async function getUserIdAsync(email,password){

    const conn = await pool.connect();
    const res = await conn.query('SELECT id_utilisateur FROM utilisateur WHERE adresse_mail=$1 AND mot_de_passe=$2', [email,password]);
    conn.release();
    if(res.rows.length!==1)
        return null;
    return res.rows[0].id_utilisateur;
}

module.exports = {
    getLoginToken:getLoginToken,
    deleteSessionAsync
}

