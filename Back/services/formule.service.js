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
        const query = `SELECT f.id_formule,f.nom_formule, f.prix_formule, f.unite, f.sur_rendezvous,STRING_AGG(a.nom_activite, ', ') AS activites_liees FROM Formule f JOIN Formule_Activite fa ON f.id_formule = fa.id_formule JOIN Activite a ON fa.id_activite = a.id_activite GROUP BY f.id_formule, f.nom_formule, f.prix_formule, f.unite, f.sur_rendezvous ORDER BY f.prix_formule ASC;`;
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
        const conn = await pool.connect();
        const query = `SELECT f.id_formule, f.nom_formule, f.prix_formule, f.unite,f.sur_rendezvous,
                              STRING_AGG(a.nom_activite, ', ') AS activites_liees
                       FROM Formule f
                                JOIN Formule_Activite fa ON f.id_formule = fa.id_formule
                                JOIN Activite a ON fa.id_activite = a.id_activite
                       WHERE f.id_formule = $1
                       GROUP BY f.id_formule, f.nom_formule, f.prix_formule, f.unite , f.sur_rendezvous
                       ORDER BY f.prix_formule ASC;`;

        const result = await conn.query(query, [id]);
        conn.release();
        return result.rows;
    } catch (error) {
        console.error('Error in getFormuleById:', error);
        throw error;
    }
}

const createFormule = (formuleData, callback) => {
    createFormuleAsync(formuleData)
        .then(res => callback(null, res))
        .catch(error => {
            console.error(error);
            callback(error, null);
        });
}

async function createFormuleAsync(formuleData) {
    const { nom_formule, prix_formule, unite, activites, sur_rendezvous } = formuleData;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Insertion de la formule
        const insertFormuleQuery = `
            INSERT INTO Formule (nom_formule, prix_formule, unite, sur_rendezvous)
            VALUES ($1, $2, $3, $4)
            RETURNING id_formule;
        `;
        const resultFormule = await client.query(insertFormuleQuery, [nom_formule, prix_formule, unite,sur_rendezvous]);
        const idFormule = resultFormule.rows[0].id_formule;

        // 2. Insertion des associations Formule_Activite
        const insertLinkQuery = `
            INSERT INTO Formule_Activite (id_formule, id_activite)
            VALUES ($1, $2);
        `;
        for (const id_activite of activites) {
            await client.query(insertLinkQuery, [idFormule, id_activite]);
        }

        await client.query('COMMIT');

        return { message: 'Formule créée avec succès', id_formule: idFormule };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erreur dans createFormuleAsync:', error);
        throw error;
    } finally {
        client.release();
    }
}
const updateFormule = (id, formuleData, callback) => {
    updateFormuleAsync(id, formuleData)
        .then(res => callback(null, res))
        .catch(err => {
            console.error(err);
            callback(err, null);
        });
};

async function updateFormuleAsync(id, formuleData) {
    const { nom_formule, prix_formule, unite, activites , sur_rendezvous } = formuleData;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Mise à jour de la formule
        const updateQuery = `
            UPDATE Formule
            SET nom_formule = $1,
                prix_formule = $2,
                unite = $3,
                sur_rendezvous = $4
            WHERE id_formule = $5;
        `;
        await client.query(updateQuery, [nom_formule, prix_formule, unite,sur_rendezvous, id]);

        // 2. Suppression des anciennes liaisons
        await client.query(`DELETE FROM Formule_Activite WHERE id_formule = $1;`, [id]);

        // 3. Insertion des nouvelles liaisons
        const insertLinkQuery = `
            INSERT INTO Formule_Activite (id_formule, id_activite)
            VALUES ($1, $2);
        `;
        for (const id_activite of activites) {
            await client.query(insertLinkQuery, [id, id_activite]);
        }

        await client.query('COMMIT');

        return { message: 'Formule mise à jour avec succès', id_formule: id };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erreur dans updateFormuleAsync:', error);
        throw error;
    } finally {
        client.release();
    }
}
const deleteFormule = (id, callback) => {
    deleteFormuleAsync(id)
        .then(res => callback(null, res))
        .catch(err => {
            console.error(err);
            callback(err, null);
        });
};

async function deleteFormuleAsync(id) {
    const client = await pool.connect();

    try {
        const deleteQuery = `DELETE FROM Formule WHERE id_formule = $1;`;
        const result = await client.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            throw new Error('Formule non trouvée');
        }

        return { message: 'Formule supprimée avec succès' };

    } catch (error) {
        console.error('Erreur dans deleteFormuleAsync:', error);
        throw error;
    } finally {
        client.release();
    }
}


module.exports = {
    getAllFormule : getAllFormule,
    getFormuleById : getFormuleById,
    createFormule: createFormule,
    updateFormule: updateFormule,
    deleteFormule: deleteFormule
}
