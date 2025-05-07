const {Pool, types} = require("pg");
require("dotenv").config();

// Désactive le parsing automatique des champs de type DATE (PostgreSQL type OID 1082)
types.setTypeParser(1082, val => val); // renvoie "YYYY-MM-DD" en string


const credentials = {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
}

const pool = new Pool(credentials);
module.exports = pool;