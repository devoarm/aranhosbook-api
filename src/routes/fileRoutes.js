var express = require("express");
var router = express.Router();
const path = require("path");
const hosOfficePath = "../../../documents/bookin";
const auth = require("../middleware/auth");
const multer = require("multer");
const {
  CheckFile,
  GetFile,
  updateFile,
  sendFtp
} = require("../controllers/fileController");
const upload = multer({ dest: "./document/bookin/" });
const multipartUpload = require('../service/multipartBook')
require("dotenv").config();


router.get("/check/:name", CheckFile);
router.get("/book-index/:name", GetFile);
// router.post("/update-book/:filename", multipartUpload, updateFile);
router.post("/update-book/:filename", updateFile);
router.get("/send-ftp/:filename", sendFtp);
module.exports = router;
