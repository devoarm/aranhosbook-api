var express = require("express");
var router = express.Router();
const path = require("path");
const hosOfficePath = "../../../documents/bookin";
const auth = require("../middleware/auth");
const multer = require("multer");
const { CheckFile, GetFile } = require("../controllers/fileController");
const upload = multer({ dest: "./public/data/uploads/" });
require("dotenv").config();
const DOCUMENT_PATH = process.env.DOCUMENT_PATH;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/check/:name", CheckFile);

router.get("/book-index/:name", GetFile);

module.exports = router;
