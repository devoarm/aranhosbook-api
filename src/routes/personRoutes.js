var express = require('express');
const { SearchFullnamePerson } = require('../controllers/personController');
var router = express.Router();

/* GET home page. */
router.get('/search-person', SearchFullnamePerson);
module.exports = router;

