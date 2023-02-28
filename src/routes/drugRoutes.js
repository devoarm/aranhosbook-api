var express = require('express');
const { getServiceDrug, getDrugBox, getPerson } = require('../controllers/drugController');

var router = express.Router();

/* GET home page. */
router.get('/list-service', getServiceDrug);
router.get('/box', getDrugBox);
router.get('/person', getPerson);
module.exports = router;

