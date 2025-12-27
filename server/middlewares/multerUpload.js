// server/middlewares/multerUpload.js

const multer = require('multer');

// Configure multer to store files in memory as a buffer
const storage = multer.memoryStorage();

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;