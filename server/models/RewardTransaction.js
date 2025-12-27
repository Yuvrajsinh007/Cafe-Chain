const mongoose = require("mongoose");

const rewardTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    cafeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cafe",
        required: true
    },
    type: {
        type: String,
        enum: ["earn", "redeem", "referral_bonus", "leaderboard_reward"],
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    description: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("RewardTransaction", rewardTransactionSchema);