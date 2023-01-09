// get the client
const mysql = require("mysql2");
require("dotenv").config();

// Create the connection pool. The pool-specific settings are the defaults
const dbQuery = mysql.createPool({
  host: process.env.hostDB,
  port: process.env.portDB,
  user: process.env.userDB,
  password: process.env.passwordDB,
  database: process.env.databaseDB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8",
});

module.exports = dbQuery;
