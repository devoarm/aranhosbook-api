var express = require("express");
var router = express.Router();
const path = require("path");
const hosOfficePath = "../../../documents/bookin";
const auth = require("../middleware/auth");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "./public/data/uploads/" });
require("dotenv").config();
const DOCUMENT_PATH = process.env.DOCUMENT_PATH;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/book-index/:name", async function (req, res, next) {
  var fileName = req.params.name;
  var haveFilse = false;  
  // fs.readdirSync(path.join(__dirname, "../documents/bookin")).forEach(
  fs.readdirSync(DOCUMENT_PATH).forEach(
    (file) => {
      console.log(`filename : ${fileName}`);
      if (file === `${fileName}`) {
        haveFilse = true;
        console.log(`file : ${file}`);
      }
    }
  );
  if (haveFilse) {
    var options = {
      // root: path.join(__dirname, "../documents/bookin"),
      root: DOCUMENT_PATH,
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true,
      },
    };

    res.sendFile(fileName, options, function (err) {
      if (err) {
        return res.json({ status: 500, msg: err.message });
      } else {
        return;
      }
    });
  } else {
    return res.json({ status: 301, msg: "no file" });
  }
});

module.exports = router;
