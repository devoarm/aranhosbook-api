var express = require("express");
const {
  getServiceDrug,
  getDrugBox,
  getPerson,
  addServiceBox,
  getWard,
  addBox,
  addDrug,
  getDrug,
} = require("../controllers/drugController");

var router = express.Router();

/* GET home page. */
router.get("/list-service", getServiceDrug);
router.get("/box", getDrugBox);
router.get("/person", getPerson);
router.get("/ward", getWard);
router.post("/add-service-box", addServiceBox);
router.post("/add-box", addBox);
router.post("/add-drug", addDrug);
router.get("/drug", getDrug);
module.exports = router;
