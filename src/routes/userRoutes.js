var express = require("express");
const { SearchHr } = require("../controllers/UserController");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ status: "OK", message: "Hosoffice Api" });
});
router.get("/search-hr", SearchHr);

module.exports = router;
