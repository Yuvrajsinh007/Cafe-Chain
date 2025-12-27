const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const cafeSchema = new mongoose.Schema({
    // --- Cafe Details ---
    name: { type: String, required: true },
    address: { type: String, required: true },
    cafePhone: { type: String, required: true },
    description: String,
    openingHours: String,
    
    // --- UPDATED: Image Gallery ---
    // Replaces 'image' and 'gallery' fields.
    // Stores an array of image objects with a max limit of 5.
    images: {
        type: [{
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }],
        validate: [
            (val) => val.length <= 5,
            'You can upload a maximum of 5 images.'
        ],
        default: []
    },
    
    features: [String],
    cafeCode: { type: String, unique: true },
    status: {
        type: String,
        enum: ['pending', 'pendingApproval', 'active', 'rejected'],
        default: 'pending_approval'
    },
    
    // --- Owner Details ---
    ownerName: { type: String, required: true },
    ownerPhone: { type: String, required: true, unique: true },

    // --- Authentication Details ---
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

}, { timestamps: true });

// Pre-save hook to hash the password (no changes here)
cafeSchema.pre('save', async function(next) {
    if (!this.isModified('password') || this.password.startsWith('$2')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password (no changes here)
cafeSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Cafe", cafeSchema);