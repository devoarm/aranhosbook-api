// get the client
const mysql = require('mysql2');
require('dotenv').config()

// Create the connection pool. The pool-specific settings are the defaults
const dbHosXp = mysql.createPool({
  host: process.env.DB_HOSXP_HOST,
  user: process.env.DB_HOSXP_USER,
  password: process.env.DB_HOSXP_PASS,
  database: process.env.DB_HOSXP_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = dbHosXp;