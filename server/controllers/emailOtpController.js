// server/controllers/emailOtpController.js

const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

// ✅ Import the centralized email service
const { sendEmail } = require('../utils/emailService');

/**
 * @desc    Verify Email OTP, create user, and log them in
 * @route   POST /api/email-otp/verify-email-otp
 * @access  Public
 */
exports.verifyEmailOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        // 1. Find the OTP entry for the given email
        const otpEntry = await OTP.findOne({ email, type: 'email' });

        if (!otpEntry) {
            return res.status(400).json({ error: "OTP expired or invalid. Please try registering again." });
        }

        // 2. Check if the provided OTP is correct
        if (otpEntry.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP provided." });
        }

        // 3. OTP is correct! Create the user from the metadata
        const userData = otpEntry.metadata;
        if (!userData) {
            return res.status(500).json({ error: "Could not retrieve user data. Please register again." });
        }
        
        const securePhoneId = `${userData.phone}-607`;

        const newUser = new User({
            ...userData,
            isEmailVerified: true, // Set email as verified
            securePhoneId: securePhoneId
        });

        // 4. Handle referral logic (if any)
        if (userData.referredBy) {
            const referrer = await User.findOne({ referralCode: userData.referredBy });
            if (referrer) {
                // Constants for XP rewards
                const XP_FOR_REFERRAL_BONUS = 200;
                const XP_FOR_NEW_USER_REFERRAL = 150;

                referrer.xp += XP_FOR_REFERRAL_BONUS;
                newUser.xp += XP_FOR_NEW_USER_REFERRAL;
                await referrer.save();
            }
        }

        await newUser.save();

        // 5. Generate a JWT token for immediate login
        const token = jwt.sign(
            { id: newUser._id, phone: newUser.phone },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 6. Clean up: Delete the used OTP entry
        await OTP.deleteOne({ _id: otpEntry._id });

        // 7. Send back the token and user info
        res.status(201).json({
            message: "Email verified and user registered successfully!",
            token,
            user: {
                name: newUser.name,
                phone: newUser.phone,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ error: "Server error during OTP verification." });
    }
};


/**
 * @desc    Resend Email OTP
 * @route   POST /api/email-otp/resend-email-otp
 * @access  Public
 */
exports.resendEmailOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        // Find the existing registration attempt
        const existingOtpEntry = await OTP.findOne({ email, type: 'email' });
        if (!existingOtpEntry) {
            return res.status(400).json({ error: "No active registration found for this email. Please start over." });
        }

        // Generate a new OTP
        const newOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Update the existing entry with the new OTP and reset the expiry timer
        existingOtpEntry.otp = newOtp;
        existingOtpEntry.createdAt = Date.now(); // Refresh expiry window
        await existingOtpEntry.save();

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
                                        <h1 style="font-family: 'Merriweather', serif; font-size: 28px; font-weight: 700; color: #6F4E37; margin: 0;">☕ One Fresh Code, Coming Right Up!</h1>
                                    </td>
                                </tr>
        
                                <tr>
                                    <td align="left" style="padding: 30px 30px 10px 30px;">
                                        <h2 style="font-family: 'Merriweather', serif; font-size: 22px; font-weight: bold; margin-top: 0; color: #4a382a;">Let's try this again.</h2>
                                        <p style="color: #555555; font-size: 16px;">No worries! Sometimes the first code gets cold or lost in the daily grind. We've brewed a brand new one for you. Please use the code below to securely access your account.</p>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td align="center" style="padding: 20px 30px;">
                                         <p style="margin-bottom: 10px; font-size: 16px; color: #555555;">Your New Verification Code:</p>
                                        <div style="background-color: #f7f5f2; border: 1px solid #6F4E37; border-radius: 8px; padding: 15px 25px; display: inline-block;">
                                            <p style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; color: #333333; letter-spacing: 5px; margin: 0;">${newOtp}</p>
                                        </div>
                                    </td>
                                </tr>
        
                                <tr>
                                    <td align="center" style="padding: 10px 30px 20px 30px;">
                                        <p style="color: #555555; font-size: 16px;">This one's extra fresh, but it will expire in <strong>10 minutes</strong>!</p>
                                        <p style="color: #888888; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
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

        // ✅ Send the new OTP via Brevo
        const emailResult = await sendEmail(
            email, 
            'Here’s a Fresh Verification Code for You!', 
            `Your new verification code is ${newOtp}. It is valid for 10 minutes.`,
            emailHtml
        );

        if (!emailResult.success) {
            console.error('Failed to resend OTP email:', emailResult.error);
            return res.status(500).json({ error: "Failed to resend OTP email. Please try again." });
        }

        console.log(`✅ Resent OTP Email to ${email}`);
        res.status(200).json({ message: "A new OTP has been sent to your email." });

    } catch (error) {
        console.error("Resend OTP Error:", error);
        res.status(500).json({ error: "Failed to resend OTP." });
    }
};