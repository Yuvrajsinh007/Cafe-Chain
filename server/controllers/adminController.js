const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const PendingCafe = require("../models/PendingCafe");
const User = require("../models/User");
const Cafe = require("../models/Cafe");
const Event = require('../models/Event');
const ContactUs = require('../models/ContactUs');
const Announcement = require("../models/Announcement");
const crypto = require("crypto");
const RewardClaim = require("../models/RewardClaim");
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { logVisit } = require("../controllers/userController");

// ✅ Import the Brevo email service
const { sendEmail } = require('../utils/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

exports.adminExists = async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    res.status(200).json({ exists: count > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Register the first and only admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // This check ensures only one admin can ever be created
    const adminExists = await Admin.findOne();
    if (adminExists) {
      return res.status(400).json({ error: 'An admin account already exists.' });
    }

    const admin = await Admin.create({ name, email, password });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        message: 'Admin account created successfully.',
      });
    } else {
      res.status(400).json({ error: 'Invalid admin data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during admin registration' });
  }
};

// Login for an existing admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during admin login' });
  }
};

// Get all pending claims
exports.getPendingClaims = async (req, res) => {
  try {
    const claims = await RewardClaim.find({ status: "pending" })
      .populate("user", "name email")
      .populate("cafe", "name");
    res.json(claims);
  } catch (err) {
    console.error("Error fetching pending claims:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Approve claim -> add points to user
exports.approveClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await RewardClaim.findById(id).populate("user").populate("cafe");

    if (!claim) return res.status(404).json({ error: "Claim not found" });
    if (claim.status !== "pending") {
      return res.status(400).json({ error: "Claim already processed" });
    }

    claim.status = "approved";
    await claim.save();

    // Call logVisit with fromAdmin = true
    await logVisit(null, null, true, {
      userPhone: claim.user.phone,
      cafeId: claim.cafe._id,
      amountSpent: claim.amount
    });

    res.json({ message: "Claim approved and points/XP added", claim });
  } catch (err) {
    console.error("Error approving claim:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Reject claim
exports.rejectClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await RewardClaim.findById(id);

    if (!claim) return res.status(404).json({ error: "Claim not found" });
    if (claim.status !== "pending") {
      return res.status(400).json({ error: "Claim already processed" });
    }

    claim.status = "rejected";
    await claim.save();

    res.json({ message: "Claim rejected", claim });
  } catch (err) {
    console.error("Error rejecting claim:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.find({}).select("name phone email createdAt").sort({ createdAt: -1 });
      res.json(users);
  } catch (err) {
      console.error("Error fetching all users:", err);
      res.status(500).json({ error: "Server error fetching users" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId)
          .populate('visitLogs')
          .populate('rewardLogs');

      if (!user) {
          return res.status(404).json({ error: "User not found." });
      }

      res.json(user);
  } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ error: "Server error fetching user profile" });
  }
};

exports.getAllCafes = async (req, res) => {
  try {
      const cafes = await Cafe.find({}).sort({ createdAt: -1 });
      res.json(cafes);
  } catch (err) {
      console.error("Error fetching all cafes:", err);
      res.status(500).json({ error: "Server error fetching cafes" });
  }
};

exports.getCafeDetails = async (req, res) => {
  try {
      const cafeId = req.params.id;
      const cafe = await Cafe.findById(cafeId);

      if (!cafe) {
          return res.status(404).json({ error: "Cafe not found." });
      }
      res.json(cafe);
  } catch (err) {
      console.error("Error fetching cafe details:", err);
      res.status(500).json({ error: "Server error fetching cafe details" });
  }
};

// Get all cafes pending approval from the temporary collection
exports.getPendingCafes = async (req, res) => {
  try {
    const cafes = await PendingCafe.find({ status: "pending_approval" });
    res.json(cafes);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching pending cafes" });
  }
};

// Approve a cafe and create permanent records in the User and Cafe collections
exports.approveCafe = async (req, res) => {
  try {
      const pendingCafeId = req.params.id;
      const pendingData = await PendingCafe.findById(pendingCafeId);
      if (!pendingData) {
          return res.status(404).json({ error: "Pending application not found." });
      }

      // Create a single new Cafe document from the pending data
      const newCafe = new Cafe({
          name: pendingData.name,
          address: pendingData.address,
          cafePhone: pendingData.cafePhone,
          description: pendingData.description,
          openingHours: pendingData.openingHours,
          image: pendingData.image,
          gallery: pendingData.gallery,
          features: pendingData.features,
          ownerName: pendingData.ownerName,
          ownerPhone: pendingData.ownerPhone,
          email: pendingData.email,
          password: pendingData.hashedPassword, // Pass the pre-hashed password
          cafeCode: crypto.randomBytes(3).toString("hex").toUpperCase(),
          status: "active",
      });

      await newCafe.save();

      // ✅ Updated to use Brevo sendEmail
      const emailResult = await sendEmail(
          pendingData.email,
          '🎉 Congratulations! Your Cafe Has Been Approved on CafeChain',
          `Hello ${pendingData.ownerName}, Your application for ${pendingData.name} has been approved! Welcome to CafeChain.`, // Fallback text
          `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
                  .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                  .header { color: #6F4E37; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                  .content { padding: 20px 0; }
                  .footer { text-align: center; font-size: 12px; color: #aaa; padding-top: 10px; border-top: 1px solid #eee; }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1 class="header">☕ Welcome to the CafeChain Family!</h1>
                  <div class="content">
                      <h2>Hello ${pendingData.ownerName},</h2>
                      <p>We are thrilled to inform you that your application for <strong>${pendingData.name}</strong> has been approved!</p>
                      <p>Your cafe is now live on the CafeChain platform. You can log in to your partner dashboard to manage your profile, view analytics, and engage with your customers.</p>
                      <p>We're excited to partner with you and help you grow your business.</p>
                      <br>
                      <p>Best regards,<br>The CafeChain Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; ${new Date().getFullYear()} CafeChain. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
          `
      );

      if (!emailResult.success) {
          console.error('Failed to send approval email to:', pendingData.email, emailResult.error);
      }

      await PendingCafe.findByIdAndDelete(pendingCafeId);

      res.json({ message: "Cafe approved and welcome email sent successfully" });
  } catch (err) {
      console.error("Approve Cafe Error:", err);
      res.status(500).json({ error: "Server error approving cafe" });
  }
};

// Reject a cafe application and remove the temporary record
exports.rejectCafe = async (req, res) => {
  try {
      const pendingCafeId = req.params.id;
      const { reason } = req.body;

      const pendingCafe = await PendingCafe.findById(pendingCafeId);
      if (!pendingCafe) {
          return res.status(404).json({ error: "Pending application not found." });
      }

      // ✅ Updated to use Brevo sendEmail
      const emailResult = await sendEmail(
          pendingCafe.email,
          'An Update on Your CafeChain Application',
          `Hello ${pendingCafe.ownerName}, regarding your application for ${pendingCafe.name}. We are unable to approve it at this time. Reason: ${reason || 'N/A'}`, // Fallback text
          `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
                  .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                  .header { color: #6F4E37; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                  .content { padding: 20px 0; }
                  .reason-box { background-color: #fffbe6; border: 1px solid #ffeeba; padding: 15px; border-radius: 4px; margin-top: 15px; }
                  .footer { text-align: center; font-size: 12px; color: #aaa; padding-top: 10px; border-top: 1px solid #eee; }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1 class="header">CafeChain Application Update</h1>
                  <div class="content">
                      <h2>Hello ${pendingCafe.ownerName},</h2>
                      <p>Thank you for your interest in joining CafeChain. After reviewing your application for <strong>${pendingCafe.name}</strong>, we are unable to approve it at this time.</p>
                      
                      ${reason ? `
                      <div class="reason-box">
                          <h4 style="margin-top:0;">Reason provided by our team:</h4>
                          <p>${reason}</p>
                      </div>
                      ` : ''}
  
                      <p>We encourage you to review the feedback and resubmit your application if you wish. If you have any questions, please don't hesitate to contact our support team.</p>
                      <br>
                      <p>Sincerely,<br>The CafeChain Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; ${new Date().getFullYear()} CafeChain. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
          `
      );

      if (!emailResult.success) {
          console.error('Failed to send rejection email to:', pendingCafe.email, emailResult.error);
      }

      await PendingCafe.findByIdAndDelete(pendingCafeId);

      res.json({ message: "Cafe application rejected and notification sent." });
  } catch (err) {
      console.error("Reject Cafe Error:", err);
      res.status(500).json({ error: "Server error rejecting cafe" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, time, cafe } = req.body;

    // 1. Validate text fields and file presence
    if (!name || !description || !date || !time || !cafe) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Event image is required.' });
    }

    // 2. Upload image to Cloudinary
    const uploadImage = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'Cafe-Chain/Events' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    };

    const uploadResult = await uploadImage();
    const imageUrl = uploadResult.secure_url;

    const combinedDateTime = new Date(`${date}T${time}`);

    const newEvent = new Event({
      name,
      description,
      eventDateTime: combinedDateTime,
      date: combinedDateTime,
      time,
      cafe,
      image: imageUrl,
    });

    await newEvent.save();

    res.status(201).json({
      message: 'Event created successfully!',
      event: newEvent,
    });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error while creating the event.' });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: "Title and Body are required." });
    }

    const announcement = await Announcement.create({ title, body });
    res.status(201).json(announcement);
  } catch (error) {
    console.error("Create Announcement Error:", error);
    res.status(500).json({ error: "Server error creating announcement" });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error deleting announcement" });
  }
};

// Test admin email endpoint
exports.testAdminEmail = async (req, res) => {
  try {
      // ✅ Updated to use Brevo sendEmail
      const emailResult = await sendEmail(
          'team.cafechain@gmail.com',
          '✅ CafeChain Admin Email System Test (Brevo)',
          'This is a test email from the Brevo system.',
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #6F4E37;">✅ CafeChain Admin Email System Active (Brevo)</h1>
              <p>This is a test email sent from the <strong>Admin Controller</strong> using <strong>Brevo (Sendinblue)</strong>.</p>
              <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h3>Admin Email Functions:</h3>
                  <p>• Cafe approval notifications</p>
                  <p>• Cafe rejection notifications</p>
                  <p>• Partner communications</p>
              </div>
              <p>Your admin email system is now working perfectly! 🎉</p>
          </div>
          `
      );

      if (emailResult.success) {
          return res.json({ 
              success: true, 
              message: 'Admin test email sent to team.cafechain@gmail.com via Brevo' 
          });
      } else {
          return res.status(500).json({ success: false, message: 'Admin email test failed', error: emailResult.error });
      }
  } catch (error) {
      console.error('Admin test error:', error);
      res.status(500).json({ success: false, message: error.message });
  }
};

exports.getContactSubmissions = async (req, res) => {
  try {
    const submissions = await ContactUs.find({}).sort({ createdAt: -1 });
    if (!submissions) {
      return res.status(404).json({ message: 'No contact submissions found.' });
    }
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).json({ error: "Server error while fetching contact submissions." });
  }
};

exports.deleteContactSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await ContactUs.findByIdAndDelete(id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }
    res.status(200).json({ message: 'Submission deleted successfully.' });
  } catch (error) {
    console.error("Error deleting contact submission:", error);
    res.status(500).json({ error: "Server error while deleting submission." });
  }
};

exports.deleteAllContactSubmissions = async (req, res) => {
  try {
    await ContactUs.deleteMany({});
    res.status(200).json({ message: 'All submissions have been deleted.' });
  } catch (error) {
    console.error("Error deleting all contact submissions:", error);
    res.status(500).json({ error: "Server error while deleting all submissions." });
  }
};

// Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCafes = await Cafe.countDocuments();
    const pendingCafes = await PendingCafe.countDocuments({ status: "pending_approval" });
    
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentRedemptions = await RewardClaim.countDocuments({ 
      createdAt: { $gte: yesterday } 
    });

    res.status(200).json({
      totalUsers,
      totalCafes,
      pendingCafes,
      recentRedemptions
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: "Server error fetching stats" });
  }
};