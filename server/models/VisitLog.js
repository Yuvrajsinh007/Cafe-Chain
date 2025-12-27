const mongoose = require("mongoose");

const visitLogSchema = new mongoose.Schema({
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
    amountSpent: {
        type: Number,
        required: true
    },
    pointsEarned: {
        type: Number,
        default: 0
    },
    xpEarned: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("VisitLog", visitLogSchema);