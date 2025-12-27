// models/RewardClaim.js
const mongoose = require("mongoose");

const rewardClaimSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe", required: true },
    amount: { type: Number, required: true },
    invoiceUrl: { type: String }, // ✅ store cloudinary url
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RewardClaim", rewardClaimSchema);