require("dotenv").config();

const dbDrug = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.DB_DRUG_HOST,
    port: process.env.DB_DRUG_PORT,
    user: process.env.DB_DRUG_USER,
    password: process.env.DB_DRUG_PASS,
    database: process.env.DB_DRUG_NAME    
  },
  // pool: {
  //   min: 0,
  //   max: 7,
  //   afterCreate: (conn, done) => {
  //     conn.query("SET NAMES utf8", (err) => {
  //       done(err, conn);
  //     });
  //   },
  // },

});
module.exports = dbDrug;
