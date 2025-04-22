/*const {Pool} = require("pg");
require("dotenv").config();

const credentials = {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
}

const pool = new Pool(credentials);
module.exports = pool;*/

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {  // ⚠️ Obligatoire pour Render
        rejectUnauthorized: false
    }
});

// Test de connexion (optionnel mais recommandé)
pool.query('SELECT NOW()')
    .then(() => console.log('✅ Connecté à la base de données'))
    .catch(err => console.error('❌ Erreur de connexion DB:', err));

module.exports = pool;