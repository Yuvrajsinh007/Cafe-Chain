const Cafe = require("../models/Cafe");
const RewardClaim = require("../models/RewardClaim");
const cloudinary = require("../config/cloudinary");

// Claim Reward
exports.claimReward = async (req, res) => {
  try {
    const { cafeId, amount } = req.body;
    const userId = req.user?._id; // from auth middleware

    if (!cafeId) {
      return res.status(400).json({ error: "Cafe is required" });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Invoice file is required" });
    }

    // Validate cafe exists
    const cafeExists = await Cafe.exists({ _id: cafeId });
    if (!cafeExists) {
      return res.status(404).json({ error: "Cafe not found" });
    }

    const newClaim = new RewardClaim({
      user: userId || null, // allow null if no auth (dev mode)
      cafe: cafeId,
      amount: Number(amount),
      invoiceUrl: req.file.path, // multer-storage-cloudinary sets this
    });

    await newClaim.save();

    res.json({
      message: "Your points are on their way! Credited within 24h.",
      claimId: newClaim._id,
      invoiceUrl: newClaim.invoiceUrl,
      status: newClaim.status,
    });
  } catch (err) {
    console.error("Claim error:", err);
    res.status(500).json({ error: "Failed to submit claim" });
  }
};

// Get cafes for dropdown
exports.getCafes = async (req, res) => {
  try {
    const cafes = await Cafe.find({}, "name _id").sort({ name: 1 });
    res.json(cafes);
  } catch (err) {
    console.error("Cafes fetch error:", err);
    res.status(500).json({ error: "Server error fetching cafes" });
  }
};

// Get user’s claim history
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    const query = userId ? { user: userId } : {}; // return all if no auth (dev mode)

    const claims = await RewardClaim.find(query)
      .populate("cafe", "name")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
