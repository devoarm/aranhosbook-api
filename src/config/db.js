require("dotenv").config();

const db_office = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.hostDB,
    port: process.env.portDB,
    user: process.env.userDB,
    password: process.env.passwordDB,
    database: process.env.databaseDB,
  },
  pool: {
    min: 0,
    max: 7,
    afterCreate: (conn, done) => {
      conn.query("SET NAMES utf8", (err) => {
        done(err, conn);
      });
    },
  },
  debug: false,

  // connection: {
  //   host: "192.168.2.7",
  //   port: 3306,
  //   user: "aranhos",
  //   password: "aranzjkowfh",
  //   database: "hosofficedb",
  //   charset: "utf8",
  //   // host: process.env.hostDB,
  //   // port: process.env.portDB,
  //   // user: process.env.userDB,
  //   // password: process.env.passwordDB,
  //   // database: process.env.databaseDB,
  // },
});
module.exports = db_office;
