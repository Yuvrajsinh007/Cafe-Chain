// server/controllers/forgotPasswordController.js
const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");

// ✅ Import the centralized email service
const { sendEmail } = require('../utils/emailService');

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    // Find user by phone
    const user = await User.findOne({ phone: mobile });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB
    const otpEntry = await OTP.findOneAndUpdate(
      { phone: mobile, type: "password_reset" }, // Using a more specific type
      { 
          otp, 
          createdAt: Date.now(),
          expiresAt: Date.now() + 5 * 60 * 1000 // OTP expires in 5 minutes
      },
      { upsert: true, new: true }
    );

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CafeChain Password Reset</title>
          <style>
              /* Basic resets for email clients */
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
                                  <h1 style="font-size: 28px; font-weight: bold; color: #6F4E37; margin: 0;">☕ CafeChain</h1>
                              </td>
                          </tr>
          
                          <tr>
                              <td align="left" style="padding: 20px 30px;">
                                  <h2 style="font-size: 20px; font-weight: bold; margin-top: 0;">Reset Your Password</h2>
                                  <p style="color: #555555; font-size: 16px;">We received a request to reset your password. Use the verification code below to complete the process.</p>
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
                                  <p style="color: #555555; font-size: 16px;">This code is valid for <strong>5 minutes</strong>.</p>
                                  <p style="color: #888888; font-size: 14px;">If you did not request a password reset, please disregard this email for your security.</p>
                              </td>
                          </tr>
                          
                          <tr>
                              <td align="center" style="padding: 20px 30px; border-top: 1px solid #eeeeee;">
                                  <p style="color: #aaaaaa; font-size: 12px; margin: 0;">© 2025 CafeChain. All rights reserved.</p>
                                  <p style="color: #aaaaaa; font-size: 12px; margin: 5px 0 0 0;">You're receiving this because a password reset was requested for your account.</p>
                              </td>
                          </tr>
          
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `;

    // ✅ Updated to use centralized sendEmail with fallback text
    const emailSent = await sendEmail(
      user.email, 
      "Your CafeChain Password Reset Code", 
      `Your password reset code is ${otp}. It expires in 5 minutes.`,
      emailHtml
    );

    // Robust error handling
    if (!emailSent.success) {
      console.error('Failed to send OTP email:', emailSent.error);
      // If email fails to send, delete the OTP we just saved.
      await OTP.findByIdAndDelete(otpEntry._id);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again later."
      });
    }

    res.json({ success: true, message: "OTP sent successfully to email" });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const record = await OTP.findOne({ phone: mobile, type: "password_reset" });
    if (!record) {
      return res.status(400).json({ success: false, message: "OTP expired or not found" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ phone: mobile });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = password; // let pre-save hook hash it
    await user.save();

    // Remove OTP after reset
    await OTP.deleteOne({ phone: mobile, type: "password_reset" });

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};