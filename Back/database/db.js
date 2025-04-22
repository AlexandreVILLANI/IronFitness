/*
const {Pool} = require("pg");
require("dotenv").config();

const credentials = {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
}

const pool = new Pool(credentials);
module.exports = pool;
*/

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Test de connexion
pool.query('SELECT NOW()')
    .then(() => console.log('✅ Connecté à la base de données'))
    .catch(err => console.error('❌ Erreur DB:', err.message));

module.exports = pool;