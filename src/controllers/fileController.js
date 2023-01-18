const saltRounds = 10;
var jwt = require("jsonwebtoken");
const db_office = require("../config/db");
const fs = require("fs");
require("dotenv").config();
const DOCUMENT_PATH = process.env.DOCUMENT_PATH;
const DOCUMENT_LOCAL = process.env.DOCUMENT_LOCAL;
const multer = require("multer");
const secret = process.env.SECRET_KEY;
const path = require("path");
var glob = require("glob");

const CheckFile = async (req, res) => {
  const {name} = req.params
  glob(`../documents/bookin/${name}`, function (er, files) {
    if (files.length > 0) {
      console.log(files)
      return res.json({ status: 200, msg: "has data" });
    } else {
      return res.json({ status: 500, msg: "has not data" });
    }
  });
};

const GetFile = async (req, res) => {
  try {
    var fileName = req.params.name;
    var options = {
      root: path.resolve("../documents/bookin"),
    };

    console.log(fileName);
    return res.sendFile(fileName, options);
  } catch (error) {
    return res.json({ status: 500, msg: error.message });
  }
};
const updateFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, `../documents/bookin`);
      },
      filename: function (req, file, callback) {
        console.log(`${filename}.${file.fieldname}`);
        // const ext = file.mimetype.split("/").filter(Boolean).slice(1).join("/");
        // callback(null, `${filename}.${ext}`);
        callback(null, `${filename}.${file.fieldname}`);
      },
    });
    var upload = multer({ storage: storage }).array("pdf", 100);
    upload(req, res, function (err) {
      if (err) {
        console.log("error");
        console.log(err);
        return res.json({ status: 500, results: "no" });
      } else {
        return res.json({ status: 200, results: "ok" });
      }
    });
  } catch (error) {
    console.log("error");
    console.log(error.message);
  }
};
const sendFtp = async (req, res) => {
  const { filename } = req.params;
  try {
    // let sftp = new Client();
    // var options = {
    //   root: DOCUMENT_LOCAL,
    // };
    // let data = fs.createReadStream(`${DOCUMENT_LOCAL}/${filename}.pdf`);
    // let remote = `${DOCUMENT_PATH}${filename}.pdf`;
    // sftp
    //   .connect({
    //     host: process.env.hostFTP,
    //     port: process.env.portFTP,
    //     username: process.env.userFTP,
    //     password: process.env.passwordFTP,
    //   })
    //   .then(async () => {
    //     const send = await sftp.put(data, remote);
    //     sftp.end();
        return res.json({ status: 200, msg: send });
    //   });
  } catch (error) {
    console.log(error.message);
    return res.json({ status: 500, msg: error.message });
  }
};
module.exports = { CheckFile, GetFile, updateFile, sendFtp };
