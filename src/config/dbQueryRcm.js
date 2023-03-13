// get the client
const mysql = require('mysql2');
require('dotenv').config()

// Create the connection pool. The pool-specific settings are the defaults
const dbRcm = mysql.createPool({
  host: process.env.DB_RCM_HOST,
  user: process.env.DB_RCM_USER,
  password: process.env.DB_RCM_PASS,
  database: process.env.DB_RCM_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = dbRcm;