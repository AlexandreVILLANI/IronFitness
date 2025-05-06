const pool = require("../database/db");

const getAllFormule = (callback) => {
    getAllFormuleAsync()
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function getAllFormuleAsync() {
    try {
        const conn = await pool.connect();
        const query = `SELECT f.id_formule,f.nom_formule, f.prix_formule, f.unite, STRING_AGG(a.nom_activite, ', ') AS activites_liees FROM Formule f JOIN Formule_Activite fa ON f.id_formule = fa.id_formule JOIN Activite a ON fa.id_activite = a.id_activite GROUP BY f.id_formule, f.nom_formule, f.prix_formule, f.unite ORDER BY f.prix_formule ASC;`;
        const result = await conn.query(query);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getAllFormuleAsync:', error);
        throw error;
    }
}

const getFormuleById = (id, callback) => {
    getFormuleByIdAsync(id)
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function getFormuleByIdAsync(id) {
    try {
        const conn = await pool.connect();  // Connexion à la base de données
        const query = `SELECT f.id_formule, f.nom_formule, f.prix_formule, f.unite,
                              STRING_AGG(a.nom_activite, ', ') AS activites_liees
                       FROM Formule f
                                JOIN Formule_Activite fa ON f.id_formule = fa.id_formule
                                JOIN Activite a ON fa.id_activite = a.id_activite
                       WHERE f.id_formule = $1
                       GROUP BY f.id_formule, f.nom_formule, f.prix_formule, f.unite
                       ORDER BY f.prix_formule ASC;`;

        const result = await conn.query(query, [id]);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getFormuleById:', error);
        throw error;
    }
}



module.exports = {
    getAllFormule : getAllFormule,
    getFormuleById : getFormuleById
}
