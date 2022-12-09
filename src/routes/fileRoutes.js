var express = require("express");
var router = express.Router();
const path = require("path");
const hosOfficePath = "../../../documents/bookin";
const auth = require("../middleware/auth");

const multer = require("multer");
const upload = multer({ dest: "./public/data/uploads/" });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/book-index/:name", function (req, res, next) {
  var options = {
    root: path.join(__dirname, hosOfficePath),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
    }
  });
});

module.exports = router;
