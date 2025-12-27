const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        // unique: true,
        // sparse: true
    },
    phone: {
        type: String,
        // The 'unique' option creates the unique index.
        // unique: true,
        // The 'sparse' option allows multiple documents with a null phone value.
        // sparse: true, 
      },
    otp: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['email', 'redemption', 'password_reset'],
        required: true
    },
    // This field is essential for storing temporary user data during registration
    metadata: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // The OTP will automatically be deleted from the database after 10 minutes
        expires: 600
    }
});

otpSchema.index({ email: 1, type: 1 }, { unique: true, sparse: true });
otpSchema.index({ phone: 1, type: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("OTP", otpSchema);