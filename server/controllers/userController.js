const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");
const Cafe = require("../models/Cafe");
const Announcement = require("../models/Announcement");
const VisitLog = require("../models/VisitLog");
const RewardTransaction = require("../models/RewardTransaction");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const ContactUs = require("../models/ContactUs");

// ✅ Import the centralized email service
const { sendEmail } = require('../utils/emailService');

const generateReferralCode = () => crypto.randomBytes(3).toString("hex");
const XP_FOR_REGISTRATION = 100;

exports.register = async (req, res) => {
    // console.log("Register body:", req.body);
    try {
        const { name, phone, password, confirmPassword, email, referralCode } = req.body;

        // Validation
        if (!email || !name || !phone || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "An account with this Email or Phone already exists." });
        }

        // Prepare user data
        const referralCodeGenerated = generateReferralCode();
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let tempUserData = {
            name,
            phone,
            email,
            password,
            referralCode: referralCodeGenerated,
            xp: XP_FOR_REGISTRATION,
            isEmailVerified: false,
        };

        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                tempUserData.referredBy = referrer.referralCode;
            }
        }

        // Save OTP data
        await OTP.findOneAndUpdate(
            { email, phone },
            {
                email,
                phone,
                otp,
                type: 'email',
                metadata: tempUserData,
                createdAt: Date.now(),
                expiresAt: Date.now() + 10 * 60 * 1000
            },
            { upsert: true, new: true }
        );

        // Email HTML template
        const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                                    <h1 style="font-size: 28px; font-weight: bold; color: #6F4E37; margin: 0;">☕ Welcome to CafeChain!</h1>
                                </td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 20px 30px;">
                                    <h2 style="font-size: 20px; font-weight: bold; margin-top: 0;">We're glad to have you.</h2>
                                    <p style="color: #555555; font-size: 16px;">Thank you for signing up. To complete your registration and secure your account, please use the following verification code:</p>
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
                                    <p style="color: #888888; font-size: 14px;">If you did not create an account with CafeChain, please disregard this email.</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding: 20px 30px; border-top: 1px solid #eeeeee;">
                                    <p style="color: #aaaaaa; font-size: 12px; margin: 0;">© 2025 CafeChain. All rights reserved.</p>
                                    <p style="color: #aaaaaa; font-size: 12px; margin: 5px 0 0 0;">You received this email because you signed up for an account.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        // ✅ Send email using centralized service
        const emailSent = await sendEmail(
            email, 
            'Welcome to CafeChain! Please Verify Your Email', 
            `Welcome to CafeChain! Your verification code is ${otp}. It is valid for 10 minutes.`,
            emailHtml
        );

        if (!emailSent.success) {
            await OTP.findOneAndDelete({ email, phone });
            return res.status(500).json({ 
                success: false, 
                message: "Unable to send verification email. Please try again later." 
            });
        }

        return res.json({
            success: true,
            message: "Registration successful. Please check your email for the OTP to verify your account.",
        });

    } catch (error) {
        console.error("Register error:", error);
        // Clean up any partially created OTP entry
        await OTP.findOneAndDelete({ email: req.body?.email, phone: req.body?.phone });
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
};

// Test endpoint
exports.testEmail = async (req, res) => {
    try {
        // ✅ Updated to use centralized sendEmail
        const emailSent = await sendEmail(
            'team.cafechain@gmail.com',
            'CafeChain - Email Service Test',
            'Your email service is working correctly.',
            '<h1>🎉 Email Test Successful!</h1><p>Your CafeChain email service is working correctly via Brevo.</p>'
        );

        if (emailSent.success) {
            return res.json({ success: true, message: 'Email test successful! Check your inbox.' });
        } else {
            return res.status(500).json({ success: false, message: 'Email test failed', error: emailSent.error });
        }
    } catch (error) {
        console.error('Test error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.login = async (req, res) => {
    const { phone, password } = req.body;
    try {
      const user = await User.findOne({ phone });
      if (!user) return res.status(400).json({ error: "User not found" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Incorrect password" });
      const token = jwt.sign(
        { id: user._id, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
      });
      res.json({ token, user: { name: user.name, phone: user.phone, profilePic: user.profilePic } });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
};


exports.getUserCafePoints = async (req, res) => {
    const { phone } = req.params;
  
    // Authorization check: User can only see their own points
    if (req.user.phone !== phone) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
  
    try {
      const user = await User.findOne({ phone }).populate({
        path: "points.cafeId",
        select: "name", // Select only the 'name' field from the Cafe model
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Format the data to be easily used by the frontend
      const cafePoints = user.points
        .map((p) => {
          // Ensure cafeId is not null before accessing its properties
          if (p.cafeId) {
            return {
              cafeName: p.cafeId.name,
              points: p.totalPoints,
            };
          }
          return null;
        })
        .filter(Boolean); // Filter out any null entries
  
      res.status(200).json(cafePoints);
    } catch (error) {
      console.error("Get user cafe points error:", error);
      res.status(500).json({ error: "Server error" });
    }
};


const getCafePoints = (user, cafeId) => {
    let cafePoints = user.points.find(p => p.cafeId.equals(cafeId));
    if (!cafePoints) {
        cafePoints = { cafeId, totalPoints: 0 };
        user.points.push(cafePoints);
    }
    return cafePoints;
};


exports.logVisit = async (req, res, fromAdmin = false, claimData = null) => {
  try {
    let userPhone, cafeId, amountSpent;

    if (fromAdmin && claimData) {
      // Called by admin (approveClaim)
      userPhone = claimData.userPhone;
      cafeId = claimData.cafeId;
      amountSpent = claimData.amountSpent;
    } else {
      // Called by user request
      ({ userPhone, cafeId, amountSpent } = req.body);

      if (!req.user || req.user.phone !== userPhone) {
        return res.status(403).json({ error: "Unauthorized access" });
      }
    }

    const user = await User.findOne({ phone: userPhone });
    if (!user) throw new Error("User not found");

    const cafe = await Cafe.findById(cafeId);
    if (!cafe) throw new Error("Cafe not found");

    // Calculate points
    let pointsEarned = Math.floor(amountSpent / 10);
    if (fromAdmin && user.hasMultiplier) {
      pointsEarned = Math.floor(pointsEarned * 1.5);
    }

    // XP
    let xpEarned = pointsEarned * 2;
    user.xp += xpEarned;

    // Add/update cafe points
    const cafeIndex = user.points.findIndex(
      (p) => p.cafeId.toString() === cafeId.toString()
    );
    if (cafeIndex >= 0) {
      user.points[cafeIndex].totalPoints += pointsEarned;
    } else {
      user.points.push({ cafeId, totalPoints: pointsEarned });
    }

    // Save visit log
    const newVisitLog = new VisitLog({
      userId: user._id,
      cafeId,
      amountSpent,
      pointsEarned,
      xpEarned
    });
    await newVisitLog.save();
    user.visitLogs.push(newVisitLog._id);

    // Save reward transaction
    const newRewardTransaction = new RewardTransaction({
      userId: user._id,
      cafeId,
      type: "earn",
      points: pointsEarned,
      description: fromAdmin
        ? "Points from admin-approved claim"
        : "Points earned from a visit."
    });
    await newRewardTransaction.save();
    user.rewardLogs.push(newRewardTransaction._id);

    await user.save();

    if (fromAdmin) {
      return { pointsEarned, xpEarned, currentPoints: user.points, currentXP: user.xp };
    }

    // Normal user flow → send API response
    res.status(200).json({
      message: "Visit logged, points and XP awarded.",
      pointsEarned,
      xpEarned,
      currentPoints: user.points,
      currentXP: user.xp
    });

  } catch (error) {
    console.error("Log visit error:", error);
    if (!fromAdmin) {
      res.status(500).json({ error: "Server error" });
    } else {
      throw error; // Let adminController handle it
    }
  }
};


exports.getUserProfile = async (req, res) => {
    const { phone } = req.params;
    try {
        // Enforce that a user can only view their own profile
        if (!req.user || req.user.phone !== phone) {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        const user = await User.findOne({ phone }).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.updateUserProfile = async (req, res) => {
    try {
      const { phone } = req.params;
      const updates = { ...req.body };
  
      if (!req.user || req.user.phone !== phone) {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  
    //   console.log("🔄 Updating profile for phone:", phone);
  
      const user = await User.findOneAndUpdate(
        { phone },
        updates,
        { new: true }
      );
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({
        message: "Profile updated successfully",
        user
      });
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile", error });
    }
}; 
  

exports.changePassword = async (req, res) => {
    const { phone } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new password are required" });
    }

    // Password validation
    if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(200).json({ message: "Logged out" });
    }
};


exports.getReferralChain = async (req, res) => {
    const { phone } = req.params;

    // Authorization check: User can only see their own referral chain
    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Helper function to build the referral tree
        const buildReferralTree = async (phoneNumber) => {
            const currentUser = await User.findOne({ phone: phoneNumber });
            if (!currentUser || currentUser.referralChildren.length === 0) {
                return { phone: phoneNumber, children: [] };
            }

            const children = await Promise.all(
                currentUser.referralChildren.map(childPhone => buildReferralTree(childPhone))
            );

            return {
                phone: phoneNumber,
                children: children
            };
        };

        const referralChain = await buildReferralTree(phone);
        res.status(200).json(referralChain);

    } catch (error) {
        console.error("Get referral chain error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getVisitHistory = async (req, res) => {
    const { phone } = req.params;

    // Authorization check
    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find all visit logs for the user, and populate the cafe details
        const visitHistory = await VisitLog.find({ userId: user._id })
            .populate("cafeId", "name address") // 'name' and 'address' from the Cafe model
            .sort({ timestamp: -1 }); // Sort by most recent visit first

        res.status(200).json(visitHistory);

    } catch (error) {
        console.error("Get visit history error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

//user's reward transaction history
exports.getRewardHistory = async (req, res) => {
    const { phone } = req.params;

    // Authorization check
    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find all reward transactions for the user, and populate the cafe details
        const rewardHistory = await RewardTransaction.find({ userId: user._id })
            .populate("cafeId", "name") // 'name' from the Cafe model
            .sort({ timestamp: -1 }); // Sort by most recent transaction first

        res.status(200).json(rewardHistory);

    } catch (error) {
        console.error("Get reward history error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.addFavoriteCafe = async (req, res) => {
    const { phone } = req.params;
    const { cafeId } = req.body;

    // Authorization check
    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const cafe = await Cafe.findById(cafeId);
        if (!cafe) {
            return res.status(404).json({ error: "Cafe not found" });
        }

        // Check if the cafe is already in the favorites list
        const isAlreadyFavorite = user.favoriteCafes.some(favId => favId.equals(cafeId));
        
        if (isAlreadyFavorite) {
            // If already a favorite, remove it
            user.favoriteCafes.pull(cafeId);
            await user.save();
            return res.status(200).json({ message: "Cafe removed from favorites.", favoriteCafes: user.favoriteCafes });
        } else {
            // If not a favorite, add it
            user.favoriteCafes.push(cafeId);
            await user.save();
            return res.status(200).json({ message: "Cafe added to favorites.", favoriteCafes: user.favoriteCafes });
        }

    } catch (error) {
        console.error("Add/remove favorite cafe error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// New endpoint: Get a user's favorite cafes
exports.getFavoriteCafes = async (req, res) => {
    const { phone } = req.params;
    
    // Authorization check
    if (req.user.phone !== phone) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    try {
        const user = await User.findOne({ phone }).populate('favoriteCafes');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ favoriteCafes: user.favoriteCafes });

    } catch (error) {
        console.error("Get favorite cafes error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getLeaderboard = async (req, res) => {
    try {
      const leaderboard = await User.find({})
        .select('name xp profilePic')
        .sort({ xp: -1 });
  
      let currentUser = null;
      if (req.user) {
        const user = await User.findById(req.user.id).select('name xp profilePic');
        if (user) {
          // find user’s rank among all users
          const rank = await User.countDocuments({ xp: { $gt: user.xp } }) + 1;
          currentUser = { ...user.toObject(), rank };
        }
      }
  
      res.status(200).json({ leaderboard, currentUser });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: "Server error" });
    }
};  

exports.getActiveAnnouncements = async (req, res) => {
    try {
      // Fetch active announcements, sorted by newest first
      const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
      res.json(announcements);
    } catch (error) {
      console.error("Fetch Announcements Error:", error);
      res.status(500).json({ error: "Server error fetching announcements" });
    }
  };

exports.submitContactForm = async (req, res) => {
    try {
      const { subject, message } = req.body;
      
      // The user's ID is attached by the middleware. Fetch the full user document.
      const user = await User.findById(req.user._id);
      if (!user) {
          return res.status(404).json({ error: "User not found." });
      }
  
      // Validate that subject and message are provided
      if (!subject || !message) {
        return res.status(400).json({ error: "Subject and message are required." });
      }
  
      const newContactUs = new ContactUs({
        username: user.name,   // Automatically get name from user profile
        email: user.email,     // Automatically get email from user profile
        subject,
        message,
        type: 'user',          // Set type automatically
      });
  
      await newContactUs.save();
  
      res.status(201).json({ message: 'Your message has been submitted successfully!' });
    } catch (error) {
      console.error("User Contact Form Error:", error);
      res.status(500).json({ error: "Server error while submitting your message." });
    }
};