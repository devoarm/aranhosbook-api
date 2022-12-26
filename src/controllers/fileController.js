const saltRounds = 10;
var jwt = require("jsonwebtoken");
const db_office = require("../config/db");
const fs = require("fs");
require("dotenv").config();
const DOCUMENT_PATH = process.env.DOCUMENT_PATH;
let Client = require("ssh2-sftp-client");
const { default: ftp } = require("../config/ftp");

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
const GetFile = async (req, res) => {
  let sftp = new Client();
  var fileName = req.params.name;
  var options = {
    root: DOCUMENT_PATH,
  };

  let remotePath = `/var/www/html/documents/bookin/${fileName}`;
  let dst = fs.createWriteStream(
    `/Users/natthaphongngaongam/Devoloper/BookAran/backend/document/bookin/${fileName}`
  );
  sftp
    .connect({
      host: "192.168.2.7",
      port: "22",
      username: "root",
      password: "hosofficeok",
    })
    .then(() => {
      return sftp.get(remotePath, dst);
    })
    .then((data) => {
      res.sendFile(fileName, options, function (err) {
        if (err) {
          return res.json({ status: 500, msg: err.message });
        } else {
          return;
        }
      });
    })
    .catch((err) => {
      console.log(err, "catch error");
    });
};

module.exports = { CheckFile, GetFile };
