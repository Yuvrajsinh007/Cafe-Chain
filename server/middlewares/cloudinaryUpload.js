// const cloudinary = require("../config/cloudinary");

// const uploadToCloudinary = async (req, res, next) => {
//   try {
//     console.log("🔍 Cloudinary middleware - checking request body...");
//     console.log("📋 Request body keys:", Object.keys(req.body));
    
//     if (req.body.profilePic && req.body.profilePic.startsWith('data:image/')) {
//       // If profilePic is provided as base64 string
//       console.log("📤 Uploading image to Cloudinary...");
//       console.log("📏 Base64 data length:", req.body.profilePic.length);
      
//       const result = await cloudinary.uploader.upload(req.body.profilePic, {
//         folder: 'Cafechain/User Profile',
//         transformation: [
//           { width: 400, height: 400, crop: 'fill', gravity: 'face' },
//           { quality: 'auto:good' }
//         ]
//       });
      
//       console.log("✅ Image uploaded successfully:", result.secure_url);
//       console.log("🆔 Cloudinary public ID:", result.public_id);
//       req.body.profilePic = result.secure_url;
//     } else if (req.body.profilePic) {
//       console.log("ℹ️ ProfilePic already a URL, skipping upload");
//       console.log("🔗 Current ProfilePic:", req.body.profilePic);
//     } else {
//       console.log("ℹ️ No ProfilePic in request body");
//     }
    
//     console.log("📤 Final request body:", req.body);
//     next();
//   } catch (error) {
//     console.error("❌ Cloudinary upload error:", error);
//     return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
//   }
// };

// module.exports = { uploadToCloudinary };

const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (req.body.profilePic && req.body.profilePic.startsWith("data:image/")) {
      const user = await User.findOne({ phone: req.params.phone });

      // Delete old image if exists
      if (user && user.profilePicId) {
        // console.log("Deleting old profile image:", user.profilePicId);
        await cloudinary.uploader.destroy(user.profilePicId);
      }

      // Upload new one
      // console.log("Uploading new profile image...");
      const result = await cloudinary.uploader.upload(req.body.profilePic, {
        folder: "Cafe-Chain/User Profile",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto:good" }
        ]
      });

      req.body.profilePic = result.secure_url;
      req.body.profilePicId = result.public_id; // save ID for later deletion
    } else if (req.body.profilePic) {
      console.log("ℹ️ ProfilePic already a URL, skipping upload");
    }

    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
  }
};

module.exports = { uploadToCloudinary };
