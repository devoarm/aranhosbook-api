var express = require("express");
var router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");
router.get("/", bookController.BookDirector);
router.post("/book-index-update-pdf/:id", bookController.BookUpdatePdf);
router.get("/book-index-send-leader-count", bookController.BookLeaderCount);
router.get("/book-index-send-leader/:id", bookController.BookIndexSendLeader);
router.post("/book-index-leader-sign/:id", bookController.BookIndexLeaderSign);
router.get("/book-index-person/:id", bookController.BookIndexPerson);

module.exports = router;
