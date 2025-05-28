const pool = require("../database/db");

const getAllCreneau = (callback) => {
    getAllCreneauAsync()
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function getAllCreneauAsync() {
    try {
        const conn = await pool.connect();
        const query = `SELECT c.id_creneau, c.id_activite,a.nom_activite, c.date_activite, c.heure_debut, c.heure_fin, c.places_disponibles,a.sur_rendezvous, COUNT(r.id_utilisateur) AS nombre_reservations FROM Creneau c JOIN Activite a ON c.id_activite = a.id_activite LEFT JOIN Reservation r ON c.id_creneau = r.id_creneau GROUP BY c.id_creneau, a.nom_activite, c.date_activite, c.heure_debut, c.heure_fin, c.places_disponibles, a.sur_rendezvous ORDER BY c.date_activite, c.heure_debut;`;
        const result = await conn.query(query);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getAllCreneauAsync:', error);
        throw error;
    }
}

const getCreneauById = (id, callback) => {
    getCreneauByIdAsync(id)
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function getCreneauByIdAsync(id) {
    try {
        const conn = await pool.connect();
        const result = await conn.query("SELECT c.id_creneau, c.id_activite, a.nom_activite, c.date_activite, c.heure_debut, c.heure_fin, c.places_disponibles, COUNT(r.id_utilisateur) AS nombre_reservations FROM Creneau c JOIN Activite a ON c.id_activite = a.id_activite LEFT JOIN Reservation r ON c.id_creneau = r.id_creneau WHERE c.id_creneau = $1 GROUP BY c.id_creneau, a.nom_activite, c.date_activite, c.heure_debut, c.heure_fin, c.places_disponibles;\n", [id]);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getCreneauByIdAsync:', error);
        throw error;
    }
}

const updateCreneau = (id_creneau,id_activite,date_activite,heure_debut,heure_fin,places_disponibles,callback) => {
    updateCreneauAsync(id_creneau,id_activite,date_activite,heure_debut,heure_fin,places_disponibles)
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function updateCreneauAsync(id_creneau,id_activite,date_activite,heure_debut,heure_fin,places_disponibles) {
    try {
        const conn = await pool.connect();
        const result = await conn.query("UPDATE Creneau SET id_activite = $2, date_activite = $3, heure_debut = $4, heure_fin = $5, places_disponibles = $6 WHERE id_creneau = $1;",[id_creneau,id_activite,date_activite,heure_debut,heure_fin,places_disponibles]);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in UPDATECRENEAUSYNC:', error);
        throw error;
    }
}

const createCreneau = (id_activite,date_activite,heure_debut,heure_fin,places_disponibles,callback)=>{
    createCreneauAsync(id_activite,date_activite,heure_debut,heure_fin,places_disponibles).
    then(res => {
        callback(null,res);
    }).catch(error => {
        console.log(error);
        callback(error,null)})
}

async function createCreneauAsync(id_activite,date_activite,heure_debut,heure_fin,places_disponibles) {
    try {
        const conn = await pool.connect();
        const result = await conn.query("INSERT INTO Creneau (id_activite, date_activite, heure_debut, heure_fin, places_disponibles) VALUES ($1, $2, $3, $4, $5) RETURNING id_creneau;",[id_activite,date_activite,heure_debut,heure_fin,places_disponibles])
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in createCreneauAsync:', error);
        throw error;
    }
}

const deleteCreneau = (id_creneau,callback)=>{
    deleteCreneauAsync(id_creneau).
    then(res => {
        callback(null,res);
    }).catch(error => {
        console.log(error);
        callback(error,null)})
}

async function deleteCreneauAsync(id_creneau) {
    try {
        const conn = await pool.connect();
        await conn.query("DELETE FROM Creneau WHERE id_creneau = $1;", [id_creneau]);
        conn.release();
        return { success: true, message: `Créneau ${id_creneau} supprimé.` };
    } catch (error) {
        console.error('Error in deleteCreneauAsync:', error);
        throw error;
    }
}

const reserverCreneau = (id_creneau, id_utilisateur, callback) => {
    reserverCreneauAsync(id_creneau, id_utilisateur)
        .then(res => callback(null, res))
        .catch(err => {
            console.error(err);
            callback(err, null);
        });
};

async function reserverCreneauAsync(id_creneau, id_utilisateur) {
    const conn = await pool.connect();
    try {
        await conn.query(
            'INSERT INTO Reservation (id_creneau, id_utilisateur) VALUES ($1, $2);',
            [id_creneau, id_utilisateur]
        );
        return { success: true, message: "Réservation enregistrée." };
    } catch (error) {
        throw error;
    } finally {
        conn.release();
    }
}

const getReservationByUserId = (id, callback) => {
    getReservationByUserIdAsync(id)
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function getReservationByUserIdAsync(id) {
    try {
        const conn = await pool.connect();
        const result = await conn.query("SELECT id_reservation, id_creneau, id_utilisateur FROM reservation WHERE id_utilisateur = $1;\n", [id]);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getReservationByUserIdAsync:', error);
        throw error;
    }
}

module.exports = {
    getAllCreneau: getAllCreneau,
    getCreneauById: getCreneauById,
    updateCreneau: updateCreneau,
    createCreneau: createCreneau,
    deleteCreneau: deleteCreneau,
    reserverCreneau: reserverCreneau,
    getReservationByUserId: getReservationByUserId
}
