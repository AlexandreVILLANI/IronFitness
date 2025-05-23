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
        const query = `SELECT id_activite,nom_activite, image_activite, description_activite, type_activite,sur_rendezvous FROM Activite`;
        const result = await conn.query(query);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getAllActiviteAsync:', error);
        throw error;
    }
}

const getActiviteByID = (id, callback) => {
    getActiviteByIDAsync(id)
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function getActiviteByIDAsync(id) {
    try {
        const conn = await pool.connect();
        const result = await conn.query("SELECT id_activite, nom_activite, image_activite, description_activite, type_activite,sur_rendezvous FROM Activite WHERE id_activite=$1", [id]);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getActiviteByIDAsync:', error);
        throw error;
    }
}

const updateActivite = (id,nom,image,description,type,sur_rendezvous,callback) => {
    updateActiviteAsync(id,nom,image,description,type,sur_rendezvous)
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function updateActiviteAsync(id,nom,image,description,type,sur_rendezvous) {
    try {
        const conn = await pool.connect();
        const result = await conn.query("UPDATE Activite SET nom_activite = $1, image_activite=$2 , description_activite = $3 , type_activite = $4 , sur_rendezvous = $5 where id_activite = $6",[nom,image,description,type,sur_rendezvous,id]);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in UPDATENBPLACEASYNC:', error);
        throw error;
    }
}

const createActivite = (activiteData, callback) => {
    createActiviteAsync(activiteData)
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.error(error);
            callback(error, null);
        });
};

async function createActiviteAsync(activiteData) {
    try {
        const { nom_activite, image_activite, description_activite, type_activite , sur_rendezvous } = activiteData;
        const conn = await pool.connect();
        const query = `
            INSERT INTO Activite (nom_activite, image_activite, description_activite, type_activite, sur_rendezvous)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_activite;
        `;
        const values = [nom_activite, image_activite, description_activite, type_activite, sur_rendezvous];
        const result = await conn.query(query, values);
        conn.release();
        return result.rows[0];
    } catch (error) {
        console.error('Error in createActiviteAsync:', error);
        throw error;
    }
}

const deleteActivite = (idActivite, callback) => {
    deleteActiviteAsync(idActivite)
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.error(error);
            callback(error, null);
        });
};

async function deleteActiviteAsync(idActivite) {
    try {
        const conn = await pool.connect();
        const query = `
            DELETE FROM Activite
            WHERE id_activite = $1;
        `;
        const values = [idActivite];
        const result = await conn.query(query, values);
        conn.release();
        return result.rowCount;
    } catch (error) {
        console.error('Error in deleteActiviteAsync:', error);
        throw error;
    }
}

module.exports = {
    getAllActivite: getAllActivite,
    getActiviteByID: getActiviteByID,
    updateActivite: updateActivite,
    createActivite: createActivite,
    deleteActivite: deleteActivite
}

