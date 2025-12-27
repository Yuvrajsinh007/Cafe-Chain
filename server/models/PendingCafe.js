const mongoose = require("mongoose");

const pendingCafeSchema = new mongoose.Schema({
    // Cafe Details
    name: { type: String, required: true },
    address: { type: String, required: true },
    cafePhone: { type: String, required: true },
    description: String,
    openingHours: String,
    image: String,
    gallery: [String],
    features: [String],
    
    // Owner Details
    ownerName: { type: String, required: true },
    ownerPhone: { type: String, required: true, unique: true },

    // Authentication Details
    email: { type: String, required: true, unique: true }, 
    // ✅ This field MUST be 'hashedPassword' to match the controller
    hashedPassword: { type: String, required: true },

    status: {
        type: String,
        enum: ['pending_approval'],
        default: 'pending_approval'
    },

}, { timestamps: true });

module.exports = mongoose.model("PendingCafe", pendingCafeSchema);