require("dotenv").config();

const db_office = require("knex")({
  client: "mysql2",
  connection: {
    // host: "192.168.2.7",
    // port: 3306,
    // user: "aranhos",
    // password: "aranzjkowfh",
    // database: "hosofficedb",
    host: process.env.hostDB,
    port: process.env.portDB,
    user: process.env.userDB,
    password: process.env.passwordDB,
    database: process.env.databaseDB,
  },
});
module.exports = db_office;
