var express = require("express");
var router = express.Router();
const authenController = require("../controllers/authenController");
const auth = require("../middleware/auth");
router.get("/me", auth, authenController.CheckToken);
router.post("/login", authenController.login);
router.post("/register", authenController.Register);

module.exports = router;
