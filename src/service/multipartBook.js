const multer = require("multer");
var multipartBook = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./document/bookin");
    },
    filename: function (req, file, callback) {
      const { filename } = req.params;
      callback(null, `${filename}.pdf`);
    },
  }),
}).single("book");

module.exports = multipartBook
