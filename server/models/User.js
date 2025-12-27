const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  securePhoneId: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true, sparse: true },
  isEmailVerified: { type: Boolean, default: false },
  profilePic: String,
  profilePicId: String,
  points: [{
    cafeId: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe" }, 
    totalPoints: { type: Number, default: 0 }
  }],
  referredBy: String,
  referralCode: String,
  referralChildren: [String],
  createdAt: { type: Date, default: Date.now },
  visitLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "VisitLog" }],
  rewardLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "RewardTransaction" }],
  xp: { type: Number, default: 0 },
  hasMultiplier: { type: Boolean, default: false },
  multiplierExpiry: { type: Date },
  favoriteCafes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cafe" }]
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);