const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Use timestamp to avoid overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer upload function
const upload = multer({ storage });

module.exports = { upload };
