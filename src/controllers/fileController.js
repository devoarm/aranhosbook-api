const saltRounds = 10;
var jwt = require("jsonwebtoken");
const db_office = require("../config/db");
const fs = require("fs");
require("dotenv").config();
const DOCUMENT_PATH = process.env.DOCUMENT_PATH;

const secret = process.env.SECRET_KEY;

const CheckFile = async (req, res) => {
  var fileName = req.params.name;
  var haveFilse = false;
  try {
    fs.readdirSync(DOCUMENT_PATH).forEach((file) => {
      if (file === `${fileName}`) {
        haveFilse = true;
      }
    });
    if (haveFilse) {
      return res.json({ status: 200, msg: "has data" });
    } else {
      return res.json({ status: 301, msg: "no data" });
    }
  } catch (error) {
    return res.json({ status: 500, msg: error.message });
  }
};

module.exports = { CheckFile };
