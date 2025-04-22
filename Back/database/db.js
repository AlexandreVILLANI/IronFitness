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

// Conversion explicite du port en nombre + valeur par défaut
const dbPort = parseInt(process.env.DB_PORT) || 5432; // 5432 par défaut si non défini

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: dbPort, // Utilisez la variable convertie
    ssl: {
        rejectUnauthorized: false // Toujours nécessaire pour Render
    }
});

// Test de connexion
pool.query('SELECT NOW()')
    .then(res => console.log('Database connected at:', res.rows[0].now))
    .catch(err => console.error('Database connection error:', err));

module.exports = pool;