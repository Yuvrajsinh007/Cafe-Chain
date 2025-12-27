const Cafe = require("../models/Cafe");
const User = require("../models/User");
const OTP = require("../models/OTP");
const Offer = require("../models/Offer");
const PendingCafe = require("../models/PendingCafe");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const VisitLog = require("../models/VisitLog");
const RewardClaim = require("../models/RewardClaim");
const RewardTransaction = require("../models/RewardTransaction");
const otpGenerator = require("otp-generator");
const cloudinary = require("../config/cloudinary"); 
const ContactUs = require("../models/ContactUs"); 

// ✅ Import the centralized email service
const { sendEmail } = require('../utils/emailService');

const generateReferralCode = () => crypto.randomBytes(3).toString("hex");

// 1. Request OTP for Registration
exports.requestCafeEmailOTP = async (req, res) => {
  const { email, ownerPhone, cafePhone, password } = req.body;

  if (!email || !ownerPhone || !cafePhone || !password) {
    return res.status(400).json({ error: "All required fields must be provided." });
  }

  try {
    // Duplication checks
    const searchCriteria = {
      $or: [
        { email: email },
        { ownerPhone: { $in: [ownerPhone, cafePhone] } },
        { cafePhone: { $in: [ownerPhone, cafePhone] } }
      ]
    };

    const existingCafe = await Cafe.findOne(searchCriteria);
    if (existingCafe) {
      res.status(409).json({ error: "An account with this email or one of these phone numbers is already registered." });
      return;
    }

    const pendingApplication = await PendingCafe.findOne(searchCriteria);
    if (pendingApplication) {
      res.status(409).json({ error: "An application with this email or one of these phone numbers is already under approval." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and metadata (include password as plain text logic replaced by hash in saving usually, keeping as per your flow)
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    // Note: Storing password in metadata for pending state. 
    const metadata = { ...req.body, hashedPassword }; 

    const otpEntry = await OTP.findOneAndUpdate(
      { email, phone: cafePhone },
      { 
          email,
          phone: cafePhone,
          otp,
          type: 'email',
          metadata,
          expiresAt: Date.now() + 10 * 60 * 1000 // Added expiry
      },
      { new: true, upsert: true }
    );

    const emailHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>CafeChain Registration</title>
                <style>
                    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f7f5f2; }
                </style>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="background-color: #f7f5f2;">
                            <table border="0" cellpadding="20" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; margin: 20px auto;">
                                <tr>
                                    <td align="center" style="padding: 20px 0 15px 0; border-bottom: 1px solid #eeeeee;">
                                        <h1 style="font-size: 28px; font-weight: bold; color: #6F4E37; margin: 0;">☕ CafeChain for Partners</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 30px;">
                                        <h2 style="font-size: 20px; font-weight: bold; margin-top: 0;">Let's get your cafe registered.</h2>
                                        <p style="color: #555555; font-size: 16px;">Welcome to CafeChain! To continue setting up your cafe profile, please use the verification code below. This ensures your account is secure.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 10px 30px;">
                                        <div style="background-color: #f2f2f2; border-radius: 8px; padding: 15px 25px;">
                                            <p style="font-size: 36px; font-weight: bold; color: #333333; letter-spacing: 5px; margin: 0;">${otp}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding: 20px 30px;">
                                        <p style="color: #555555; font-size: 16px;">This code is valid for <strong>10 minutes</strong>.</p>
                                        <p style="color: #888888; font-size: 14px;">For your security, please do not share this code with anyone. If you did not attempt to register a cafe, please ignore this email.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 30px; border-top: 1px solid #eeeeee;">
                                        <p style="color: #aaaaaa; font-size: 12px; margin: 0;">© 2025 CafeChain. All rights reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;
        
    // ✅ Updated to use centralized sendEmail
    const emailResult = await sendEmail(
        email, 
        'Confirm Your CafeChain Partner Account', 
        `Welcome to CafeChain! Your verification code is ${otp}. It is valid for 10 minutes.`,
        emailHtml
    );

    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      // If email fails, delete the OTP to allow user to try again
      await OTP.findByIdAndDelete(otpEntry._id);
      return res.status(500).json({ 
        success: false, 
        message: "Unable to send verification email. Please try again later." 
      });
    }

    res.status(200).json({
      message: "OTP sent to your email.",
      email: email
    });
  } catch (error) {
    console.error("OTP Request Error:", error);
    res.status(500).json({ error: "Server error during registration check." });
  }
};

// 2. Verify OTP and Create a Temporary Session (create PendingCafe)
exports.verifyCafeEmailOTP = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const otpDocument = await OTP.findOne({ 
      email, 
      otp, 
      type: 'email',
  });
    if (!otpDocument) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // Now, otpDocument.metadata contains 'hashedPassword', which matches the model.
    const newPendingCafe = new PendingCafe(otpDocument.metadata);
    await newPendingCafe.save(); // This will no longer cause a validation error.

    await OTP.deleteOne({ _id: otpDocument._id });

    res.status(201).json({ message: "Email verified! Your application has been submitted for approval." });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    res.status(500).json({ error: "Server error during verification." });
  }
};

// 3. Login for cafe owner
exports.loginCafe = async (req, res) => {
  // ✅ DEBUG: Add this console log to check your environment variable
  // console.log("JWT Secret being used:", process.env.JWT_SECRET);

  const { email, password } = req.body;
  try {
    const cafe = await Cafe.findOne({ email });
    if (!cafe) {
      return res.status(404).json({ error: "No account found with this email." });
    }
    const isMatch = await cafe.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password." });
    }
    if (cafe.status !== 'active') {
      return res.status(403).json({ error: `This cafe's account is not active. Current status: '${cafe.status}'.` });
    }

    // This line will crash if the JWT_SECRET is undefined
    const token = jwt.sign(
      { id: cafe._id, name: cafe.name, role: 'cafe' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      cafe: { id: cafe._id, name: cafe.name, email: cafe.email, status: cafe.status }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
};

// 4. Add a new image to a cafe's gallery
exports.addCafeImage = async (req, res) => {
  const { image } = req.body;
  // The middleware already fetched the full cafe object and attached it to req.user
  const cafe = req.user;

  if (!image) {
      return res.status(400).json({ error: "Image data is required." });
  }

  try {
      // No need to find the cafe again, we already have it.
      
      if (cafe.images.length >= 5) {
          return res.status(400).json({ error: "Cannot add more than 5 images." });
      }

      // Sanitize the cafe name to create a safe folder name.
      const safeCafeName = cafe.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');

      // Upload to Cloudinary in a cafe-specific folder
      const result = await cloudinary.uploader.upload(image, {
          folder: `Cafe-Chain/Cafe/${safeCafeName}_${cafe._id}`,
          transformation: [
              { width: 1024, height: 768, crop: 'limit' },
              { quality: 'auto:good' }
          ]
      });

      cafe.images.push({
          url: result.secure_url,
          public_id: result.public_id
      });

      await cafe.save();

      res.status(200).json({
          message: "Image added successfully!",
          images: cafe.images
      });

  } catch (error) {
      console.error("Add Cafe Image Error:", error);
      res.status(500).json({ error: "Server error while adding image." });
  }
};

// 5. Delete an image from a cafe's gallery
exports.deleteCafeImage = async (req, res) => {
  const { public_id } = req.body;
  // --- The middleware has already found the cafe for you! ---
  const cafe = req.user;

  if (!public_id) {
      return res.status(400).json({ error: "Image public_id is required." });
  }

  try {
      // No need to find the cafe again, the middleware already did.

      const imageExists = cafe.images.some(img => img.public_id === public_id);
      if (!imageExists) {
          return res.status(404).json({ error: "Image not found in your gallery." });
      }

      await cloudinary.uploader.destroy(public_id);

      cafe.images = cafe.images.filter(img => img.public_id !== public_id);
      await cafe.save();

      res.status(200).json({
          message: "Image deleted successfully!",
          images: cafe.images
      });

  } catch (error) {
      console.error("Delete Cafe Image Error:", error);
      res.status(500).json({ error: "Server error while deleting image." });
  }
};


exports.getCafeDashboardAnalytics = async (req, res) => {
  try {
    // The middleware `authenticateCafeOwnerJWT` already finds the cafe
    // and attaches it as `req.user`. So, `req.user._id` is the cafe's ID.
    const cafeId = req.user._id;

    // No need to find the cafe again, we already have its ID.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Use the cafeId directly in your queries.
    const totalVisits = await VisitLog.countDocuments({ cafeId: cafeId });

    const redeemedClaimsToday = await RewardClaim.find({
      cafe: cafeId, // In RewardClaim schema, the field is named 'cafe'
      status: "approved",
      createdAt: { $gte: startOfToday },
    });

    const pointsRedeemedToday = redeemedClaimsToday.reduce(
      (sum, claim) => sum + claim.amount,
      0
    );

    res.status(200).json({
      totalCustomerVisits: totalVisits,
      pointsRedeemedToday,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ error: "Server error fetching analytics." });
  }
};

exports.getCustomerPointsForCafe = async (req, res) => {
  try {
    const { customerPhone } = req.body;
    const cafeId = req.user._id; // The logged-in cafe's ID from the auth middleware

    if (!customerPhone) {
      return res.status(400).json({ error: "Customer phone number is required." });
    }

    // Find the customer by their phone number
    const customer = await User.findOne({ phone: customerPhone });
    if (!customer) {
      return res.status(404).json({ error: "No customer found with this phone number." });
    }

    // Find the specific points entry for the logged-in cafe
    const cafePointsData = customer.points.find(p => p.cafeId.equals(cafeId));

    // If the customer has never visited this cafe, their points are 0
    const currentPoints = cafePointsData ? cafePointsData.totalPoints : 0;

    res.status(200).json({
      customerName: customer.name,
      points: currentPoints,
    });

  } catch (error) {
    console.error("Error fetching customer points:", error);
    res.status(500).json({ error: "Server error while fetching customer points." });
  }
};

exports.initiateRedemption = async (req, res) => {
  const { customerPhone, pointsToRedeem } = req.body;
  const cafe = req.user;

  // ✅ Convert pointsToRedeem to a number right away.
  const pointsToRedeemNum = parseInt(pointsToRedeem, 10);

  if (!customerPhone || !pointsToRedeemNum || pointsToRedeemNum <= 0) {
    return res.status(400).json({ error: "Valid customer phone and a positive number of points are required." });
  }

  try {
    const customer = await User.findOne({ phone: customerPhone });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    const cafePoints = customer.points.find(p => p.cafeId.equals(cafe._id));
    const currentPoints = cafePoints ? cafePoints.totalPoints : 0;

    // ✅ Compare numbers and provide a detailed error message.
    if (!cafePoints || currentPoints < pointsToRedeemNum) {
      return res.status(400).json({
        error: `Customer has insufficient points. They have ${currentPoints} points but tried to redeem ${pointsToRedeemNum}.`
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    const otpEntry = await OTP.findOneAndUpdate(
      { email: customer.email, type: 'redemption' },
      {
          email: customer.email,
          otp,
          type: 'redemption',
          metadata: { cafeId: cafe._id, userId: customer._id, points: pointsToRedeemNum },
          expiresAt: Date.now() + 10 * 60 * 1000
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              /* Basic resets for email clients */
              body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
              table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
              img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
              body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f7f5f2; }
              @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Lato:wght@400;700&display=swap');
          </style>
      </head>
      <body style="font-family: 'Lato', Arial, sans-serif; line-height: 1.6; color: #333333;">
  
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                  <td align="center" style="background-color: #f7f5f2;">
                      <table border="0" cellpadding="20" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; margin: 20px auto; border: 1px solid #e0dccc;">
                          
                          <tr>
                              <td align="center" style="padding: 20px 0 15px 0; border-bottom: 1px solid #eeeeee;">
                                  <h1 style="font-family: 'Merriweather', serif; font-size: 28px; font-weight: 700; color: #6F4E37; margin: 0;">Your Loyalty, Rewarded!</h1>
                              </td>
                          </tr>
  
                          <tr>
                              <td align="left" style="padding: 30px 30px 10px 30px;">
                                  <h2 style="font-family: 'Merriweather', serif; font-size: 22px; font-weight: bold; margin-top: 0; color: #4a382a;">Ready for your well-deserved treat?</h2>
                                  <p style="color: #555555; font-size: 16px;">All that loyalty has paid off! You're just a moment away from enjoying something special, on us. Here are the delicious details:</p>
                              </td>
                          </tr>
  
                          <tr>
                               <td align="center" style="padding: 10px 30px;">
                                  <table border="0" cellpadding="15" cellspacing="0" width="100%" style="background-color: #fdfaf5; border-radius: 8px; border: 1px solid #e0dccc;">
                                      <tr>
                                          <td align="left" style="font-size: 16px; color: #555555;">
                                              <strong>Points Redeemed:</strong>
                                              <span style="float: right; font-weight: bold; color: #333333;">${pointsToRedeemNum}</span>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="left" style="font-size: 16px; color: #555555; border-top: 1px solid #e0dccc;">
                                              <strong>Your Destination:</strong>
                                              <span style="float: right; font-weight: bold; color: #333333;">${cafe.name}</span>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          
                          <tr>
                              <td align="center" style="padding: 30px;">
                                  <p style="margin-bottom: 10px; font-size: 16px; color: #555555;">Use this magic code to unlock your treat:</p>
                                  <div style="border: 2px solid #6F4E37; border-radius: 8px; padding: 15px 25px; display: inline-block;">
                                      <p style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; color: #333333; letter-spacing: 5px; margin: 0;">${otp}</p>
                                  </div>
                              </td>
                          </tr>
  
                          <tr>
                              <td align="center" style="padding: 0 30px 20px 30px;">
                                  <p style="color: #888888; font-size: 14px; margin: 0;">Like a perfect coffee, this code is best served hot! It will expire in <strong>10 minutes</strong>.</p>
                                  <p style="color: #c0392b; font-size: 14px; font-weight: bold; margin-top: 10px;">Not you? If you didn't request this, please contact our support team immediately to keep your points safe.</p>
                              </td>
                          </tr>
                          
                          <tr>
                              <td align="center" style="padding: 20px 30px; border-top: 1px solid #eeeeee;">
                                  <p style="color: #aaaaaa; font-size: 12px; margin: 0;">Enjoy your reward! © 2025 CafeChain</p>
                              </td>
                          </tr>
  
                      </table>
                  </td>
              </tr>
          </table>
  
      </body>
      </html>
    `;

    // ✅ Updated to use centralized sendEmail
    const emailResult = await sendEmail(
      customer.email, 
      `Your CafeChain Reward at ${cafe.name} Awaits!`,
      `Your reward redemption code is ${otp}. Use this to redeem ${pointsToRedeemNum} points at ${cafe.name}.`,
      emailHtml
    );

    if (!emailResult.success) {
      await OTP.findByIdAndDelete(otpEntry._id);
      return res.status(500).json({ 
        success: false, 
        message: "Unable to send redemption OTP to the customer. Please try again." 
      });
    }

    res.status(200).json({ message: "OTP sent to customer's email.", customerEmail: customer.email });
  } catch (error) {
    console.error("Redemption initiation error:", error);
    res.status(500).json({ error: "Server error during redemption initiation." });
  }
};

exports.verifyRedemption = async (req, res) => {
  const { otp, customerEmail } = req.body;

  if (!otp || !customerEmail) {
    res.status(400).json({ error: "OTP and customer email are required." });
    return;
  }

  try {
    const otpDocument = await OTP.findOne({ email: customerEmail, otp, type: 'redemption' });
    if (!otpDocument) {
      res.status(400).json({ error: "Invalid or expired OTP." });
      return;
    }
    const { cafeId, userId, points } = otpDocument.metadata;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "Customer user not found." });
      return;
    }
    const cafePoints = user.points.find(p => p.cafeId.equals(cafeId));
    if (!cafePoints || cafePoints.totalPoints < points) {
      res.status(400).json({ error: "Not enough points to redeem." });
      return;
    }
    cafePoints.totalPoints -= points;
    user.markModified('points');
    await user.save();

    const newRewardTransaction = new RewardTransaction({
      userId: user._id,
      cafeId,
      type: "redeem",
      points: -points,
      description: `Redeemed ${points} points at the cafe.`
    });
    await newRewardTransaction.save();

    await OTP.deleteOne({ _id: otpDocument._id });

    res.status(200).json({ message: "Points redeemed successfully!" });
    return;
  } catch (error) {
    console.error("Redemption verification error:", error);
    res.status(500).json({ error: "Server error during redemption verification." });
    return;
  }
};

exports.getLoyaltyProgramMetrics = async (req, res) => {

  try {
    const cafeId = req.user._id;
    // --- Timeframes ---
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);


// 1. Points Redeemed Today & Number of Transactions Today

    const todaysRedemptions = await RewardClaim.find({
      cafe: cafeId,
      status: "approved",
      createdAt: { $gte: startOfToday },
    });

    const pointsRedeemedToday = todaysRedemptions.reduce(
      (sum, claim) => sum + claim.amount, 0
    );
    const redemptionTransactionsToday = todaysRedemptions.length;
    // 2. Redemption Rate (Monthly)

    const monthlyRedemptions = await RewardClaim.countDocuments({
      cafe: cafeId,
      status: "approved",
      createdAt: { $gte: startOfMonth },
    });
    const monthlyVisits = await VisitLog.countDocuments({
      cafe: cafeId,
      createdAt: { $gte: startOfMonth },
    });

    // Avoid division by zero
    const redemptionRate = monthlyVisits > 0
      ? ((monthlyRedemptions / monthlyVisits) * 100).toFixed(1)
      : 0;
    // 3. Average Points Per Transaction (Today)

    const avgPointsPerTransaction = redemptionTransactionsToday > 0
      ? (pointsRedeemedToday / redemptionTransactionsToday).toFixed(1)
      : 0;
    // --- Send Response ---
    res.status(200).json({
      pointsRedeemedToday,
      redemptionRate,
      avgPointsPerTransaction,
    });
  } catch (error) {
    console.error("Loyalty metrics fetch error:", error);
    res.status(500).json({ error: "Server error fetching loyalty metrics." });
  }
};  

exports.getActivityLog = async (req, res) => {
  try {
    const cafeId = req.user._id;
    const { filter } = req.query; // e.g., 'today', 'week', 'month', 'all'

    const query = { cafeId: cafeId };

    // Set the time to the beginning of the day in the server's local timezone
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filter === 'today') {
      query.createdAt = { $gte: now };
    } else if (filter === 'week') {
      // Go back to the beginning of the day 7 days ago
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      query.createdAt = { $gte: startOfWeek };
    } else if (filter === 'month') {
      // Go back to the beginning of the day 1 month ago
      const startOfMonth = new Date(now);
      startOfMonth.setMonth(now.getMonth() - 1);
      query.createdAt = { $gte: startOfMonth };
    }
    // For the 'all' filter, we don't add a date constraint to the query.
    
    // Fetch all relevant transactions from the correct model
    const transactions = await RewardTransaction.find(query).sort({ createdAt: -1 });

    res.status(200).json(transactions);

  } catch (error) {
    console.error("Activity log fetch error:", error);
    res.status(500).json({ error: "Server error fetching activity log." });
  }
};

exports.getCafeProfile = async (req, res) => {
  try {
    // The middleware already fetched the full cafe object and attached it to req.user
    const cafe = req.user;
    res.status(200).json({ cafe });
  } catch (error) {
    console.error("Get Cafe Profile Error:", error);
    res.status(500).json({ error: "Server error while fetching cafe profile." });
  }
};

// 6. Update Cafe Profile
exports.updateCafeProfile = async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.status(200).json({ cafe });
  } catch (error) {
    console.error("Update Cafe Profile Error:", error);
    res.status(500).json({ error: "Server error while updating cafe profile." });
  }
};


// A. Request Password Reset OTP
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required." });
    }
  
    try {
      const cafe = await Cafe.findOne({ email });
      if (!cafe) {
        return res.status(404).json({ error: "No cafe account is registered with this email address." });
      }
  
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
  
      // Save OTP to the database, linked to the email
      const otpEntry = await OTP.findOneAndUpdate(
        { email, type: 'password_reset' },
        { email, otp, type: 'password_reset', expiresAt: Date.now() + 10 * 60 * 1000 },
        { new: true, upsert: true }
      );
  
      const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CafeChain Password Reset</title>
            <style>
                body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f7f5f2; }
            </style>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="background-color: #f7f5f2;">
                        <table border="0" cellpadding="20" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; margin: 20px auto;">
                            <tr>
                                <td align="center" style="padding: 20px 0 15px 0; border-bottom: 1px solid #eeeeee;">
                                    <h1 style="font-size: 28px; font-weight: bold; color: #6F4E37; margin: 0;">☕ CafeChain for Partners</h1>
                                </td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 20px 30px;">
                                    <h2 style="font-size: 20px; font-weight: bold; margin-top: 0;">Reset Your Password</h2>
                                    <p style="color: #555555; font-size: 16px;">We received a request to reset the password for your account. Please use the verification code below to set up a new password.</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 10px 30px;">
                                    <div style="background-color: #f2f2f2; border-radius: 8px; padding: 15px 25px;">
                                        <p style="font-size: 36px; font-weight: bold; color: #333333; letter-spacing: 5px; margin: 0;">${otp}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 20px 30px;">
                                    <p style="color: #555555; font-size: 16px;">This code is valid for <strong>10 minutes</strong>.</p>
                                    <p style="color: #888888; font-size: 14px;">If you did not request a password reset, please ignore this email or contact our support if you have any concerns.</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 30px; border-top: 1px solid #eeeeee;">
                                    <p style="color: #aaaaaa; font-size: 12px; margin: 0;">© 2025 CafeChain. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `;

      // ✅ Updated to use centralized sendEmail
      const emailResult = await sendEmail(
        email, 
        'Your CafeChain Password Reset Code', 
        `Your password reset OTP is ${otp}. It is valid for 10 minutes.`,
        emailHtml
      );

      if (!emailResult.success) {
        await OTP.findByIdAndDelete(otpEntry._id);
        return res.status(500).json({ 
            success: false, 
            message: "Unable to send password reset email. Please try again later." 
        });
      }
  
      res.status(200).json({ message: "An OTP has been sent to your email address." });
  
    } catch (error) {
      console.error("Request Password Reset Error:", error);
      res.status(500).json({ error: "Server error. Please try again." });
    }
};
  
  // B. Verify Password Reset OTP
exports.verifyPasswordResetOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }
  
    try {
      const otpDocument = await OTP.findOne({ email, otp, type: 'password_reset' });
  
      if (!otpDocument) {
        return res.status(400).json({ message: "Invalid or expired OTP. Please try again." });
      }
  
      // OTP is correct, remove it so it can't be used again
      await OTP.deleteOne({ _id: otpDocument._id });
    
      // Respond with success to allow frontend navigation to the reset page
      res.status(200).json({ success: true, message: "OTP verified successfully." });
  
    } catch (error) {
      console.error("Verify Password Reset OTP Error:", error);
      res.status(500).json({ error: "Server error during OTP verification." });
    }
};
  
  // C. Reset Password after successful OTP verification
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required." });
    }
  
    try {
      const cafe = await Cafe.findOne({ email });
      if (!cafe) {
        return res.status(404).json({ error: "Cafe account not found." });
      }
  
      // Hash the new password and save it
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      cafe.password = hashedPassword;
      await cafe.save();
  
      res.status(200).json({ success: true, message: "Password has been updated successfully." });
  
    } catch (error) {
      console.error("Reset Password Error:", error);
      res.status(500).json({ error: "Server error while resetting password." });
    }
};

// Get all offers for the logged-in cafe
exports.getOffers = async (req, res) => {
  try {
      // req.user is the full cafe object from the auth middleware
      const offers = await Offer.find({ cafe: req.user._id }).sort({ createdAt: -1 });
      res.status(200).json(offers);
  } catch (error) {
      console.error("Get Offers Error:", error);
      res.status(500).json({ error: "Server error while fetching offers." });
  }
};

// Add a new offer for the logged-in cafe
exports.addOffer = async (req, res) => {
  const { name, pointsRequired } = req.body;
  const cafeId = req.user._id;

  if (!name || !pointsRequired) {
      return res.status(400).json({ error: "Offer name and points are required." });
  }

  try {
      const newOffer = new Offer({
          cafe: cafeId,
          name,
          pointsRequired
      });
      await newOffer.save();
      res.status(201).json({ message: "Offer added successfully!", offer: newOffer });
  } catch (error) {
      console.error("Add Offer Error:", error);
      res.status(500).json({ error: "Server error while adding offer." });
  }
};

exports.deleteOffer = async (req, res) => {
  const { offerId } = req.params;
  const cafeId = req.user._id;

  try {
      const result = await Offer.deleteOne({ _id: offerId, cafe: cafeId });

      if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Offer not found or you do not have permission to delete it." });
      }

      res.status(200).json({ message: "Offer deleted successfully." });
  } catch (error) {
      console.error("Delete Offer Error:", error);
      res.status(500).json({ error: "Server error while deleting offer." });
    }
};

exports.submitContactForm = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const cafe = req.user; // Middleware attaches the authenticated cafe object

    // Validate input
    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required." });
    }

    const newContactUs = new ContactUs({
      username: cafe.name, // Automatically get name from cafe profile
      email: cafe.email,       // Automatically get email from cafe profile
      subject,
      message,
      type: 'cafe',            // Set type automatically
    });

    await newContactUs.save();

    res.status(201).json({ message: 'Your message has been submitted successfully!' });
  } catch (error) {
    console.error("Cafe Contact Form Error:", error);
    res.status(500).json({ error: "Server error while submitting your message." });
  }
};