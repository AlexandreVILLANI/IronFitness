const pool = require("../database/db");

const getAllActivite = (callback) => {
    getAllActiviteAsync()
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function getAllActiviteAsync() {
    try {
        const conn = await pool.connect();
        const query = `SELECT id_activite,nom_activite, image_activite, description_activite, type_activite FROM Activite`;
        const result = await conn.query(query);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getAllActiviteAsync:', error);
        throw error;
    }
}

module.exports = {
    getAllActivite : getAllActivite,
}