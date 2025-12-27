const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { claimReward, getCafes, getHistory, } = require("../controllers/rewardController");

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "Cafe-Chain/Invoice",
      resource_type: "auto", // supports pdf + images
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      public_id: Date.now() + "-" + file.originalname.split(".")[0],
    };
  },
});
const upload = multer({ storage });

// Routes
router.get("/cafes", getCafes);
router.post("/claim", upload.single("invoice"), claimReward);
router.get("/invoice-history", getHistory);

module.exports = router;