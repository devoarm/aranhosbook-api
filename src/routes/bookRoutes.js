var express = require("express");
var router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");
router.get("/", bookController.BookDirector);
router.post("/book-index-update-pdf/:id", bookController.BookUpdatePdf);

router.get(
  "/book-index-send-leader/:id",
  bookController.BookIndexSendLeader
);
router.post("/book-index-leader-sign/:id", bookController.BookIndexLeaderSign);
router.get("/book-index-person/:id", bookController.BookIndexPerson);
router.get("/book-index-leader-decide/:bookId", bookController.BookIndexLeaderDecide);
// router.get("/book-index-history-person/:authId", bookController.BookHistoryPerson);
router.get("/book-index-history-person", bookController.BookHistoryPerson);
router.get("/book-index-history-leader", bookController.BookHistoryLeader);
router.post("/book-send-person", bookController.BookSendPerson);
router.post("/book-send-to-secretary", bookController.BookSendToSecretary);
router.post('/book-index-person/readed',bookController.BookOnRead)
module.exports = router;
