const pool = require("../database/db");
const {get} = require("axios");

const getAllGoodies = (callback) => {
    getAllGoodiesAsync()
        .then(res => {
            callback(null, res);
        })
        .catch(error => {
            console.log(error);
            callback(error, null);
        });
}

async function getAllGoodiesAsync() {
    try {
        const conn = await pool.connect();
        const query = `
            SELECT
                g.id_goodies,
                g.nom_goodies,
                g.image_goodies,
                g.prix_goodies,
                STRING_AGG(
                        CONCAT(t.id_taille, ':', t.valeur_taille, ':', tg.quantite_stock),
                        ',' ORDER BY t.id_taille
                ) AS tailles
            FROM
                Goodies g
                    LEFT JOIN
                Taille_goodies tg ON g.id_goodies = tg.id_goodies
                    LEFT JOIN
                Taille t ON tg.id_taille = t.id_taille
            GROUP BY
                g.id_goodies, g.nom_goodies, g.image_goodies, g.prix_goodies
            ORDER BY
                g.id_goodies;
        `;
        const result = await conn.query(query);
        conn.release();

        // Parsing des tailles regroupées
        const goodies = result.rows.map(row => {
            let tailles = [];
            if (row.tailles) {
                tailles = row.tailles.split(',').map(str => {
                    const [id_taille, valeur_taille, quantite_stock] = str.split(':');
                    return {
                        id_taille: parseInt(id_taille),
                        valeur_taille,
                        quantite_stock
                    };
                });
            }

            return {
                id_goodies: row.id_goodies,
                nom_goodies: row.nom_goodies,
                image_goodies: row.image_goodies,
                prix_goodies: row.prix_goodies,
                tailles
            };
        });

        return goodies;
    } catch (error) {
        console.error('Error in getAllGoodiesAsync:', error);
        throw error;
    }
}

const createGoodies = async (goodiesData, callback) => {
    try {
        const conn = await pool.connect();
        await conn.query('BEGIN');

        const { nom_goodies, image_goodies, prix_goodies, tailles } = goodiesData;

        // Insertion du goodies
        const insertGoodiesQuery = `
            INSERT INTO Goodies(nom_goodies, image_goodies, prix_goodies)
            VALUES ($1, $2, $3)
            RETURNING id_goodies
        `;
        const resGoodies = await conn.query(insertGoodiesQuery, [nom_goodies, image_goodies, prix_goodies]);
        const id_goodies = resGoodies.rows[0].id_goodies;

        // Insertion des tailles liées
        for (const taille of tailles) {
            const { id_taille, disponible } = taille;
            await conn.query(`
                INSERT INTO Taille_goodies(id_goodies, id_taille, quantite_stock)
                VALUES ($1, $2, $3)
            `, [id_goodies, id_taille, disponible]);
        }

        await conn.query('COMMIT');
        conn.release();
        callback(null, { id_goodies });
    } catch (error) {
        console.error('Error in createGoodies:', error);
        callback(error, null);
    }
};

const updateGoodies = async (id_goodies, goodiesData, callback) => {
    try {
        const conn = await pool.connect();
        await conn.query('BEGIN');

        const { nom_goodies, image_goodies, prix_goodies, tailles } = goodiesData;

        // Mise à jour du goodies
        await conn.query(`
            UPDATE Goodies
            SET nom_goodies = $1, image_goodies = $2, prix_goodies = $3
            WHERE id_goodies = $4
        `, [nom_goodies, image_goodies, prix_goodies, id_goodies]);

        // Suppression des tailles existantes pour ce goodies
        await conn.query(`DELETE FROM Taille_goodies WHERE id_goodies = $1`, [id_goodies]);

        // Réinsertion des tailles
        for (const taille of tailles) {
            const { id_taille, disponible } = taille;
            await conn.query(`
                INSERT INTO Taille_goodies(id_goodies, id_taille, quantite_stock)
                VALUES ($1, $2, $3)
            `, [id_goodies, id_taille, disponible]);
        }

        await conn.query('COMMIT');
        conn.release();
        callback(null, { success: true });
    } catch (error) {
        console.error('Error in updateGoodies:', error);
        callback(error, null);
    }
};

const deleteGoodies = async (id_goodies, callback) => {
    try {
        const conn = await pool.connect();
        await conn.query('BEGIN');

        // Suppression automatique de Taille_goodies grâce à ON DELETE CASCADE
        await conn.query(`DELETE FROM Goodies WHERE id_goodies = $1`, [id_goodies]);

        await conn.query('COMMIT');
        conn.release();
        callback(null, { success: true });
    } catch (error) {
        console.error('Error in deleteGoodies:', error);
        callback(error, null);
    }
};


module.exports = {
    getAllGoodies: getAllGoodies,
    createGoodies: createGoodies,
    updateGoodies: updateGoodies,
    deleteGoodies: deleteGoodies
}