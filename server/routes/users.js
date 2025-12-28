const express = require("express");
const router = express.Router();
const { 
    register,
    login,
    logVisit,
    getUserCafePoints,
    getUserProfile,
    updateUserProfile,
    changePassword,
    logout,
    getReferralChain,
    getRewardHistory,
    getVisitHistory,
    addFavoriteCafe,
    getFavoriteCafes,
    getLeaderboard,
    testEmail,
    getActiveAnnouncements,
    submitContactForm  
} = require("../controllers/userController");

const { validatePhoneNumber } = require("../middlewares/validate");
const { authenticateUserJWT } = require("../middlewares/auth");
const { uploadToCloudinary } = require("../middlewares/cloudinaryUpload");

// router.get("/", "Welcome");
router.post("/register", validatePhoneNumber, register);
router.post("/login", validatePhoneNumber, login);

router.post("/log-visit", authenticateUserJWT, logVisit);
router.get("/profile/:phone", authenticateUserJWT, getUserProfile);
router.put("/profile/:phone", authenticateUserJWT, uploadToCloudinary, updateUserProfile);
router.put("/profile/:phone/change-password", authenticateUserJWT, changePassword);
router.post("/logout", authenticateUserJWT, logout);

router.get("/referral-chain/:phone", authenticateUserJWT, getReferralChain);
router.get("/cafe-points/:phone", authenticateUserJWT, getUserCafePoints);
router.get("/history/:phone", authenticateUserJWT, getVisitHistory); 
router.get("/rewards/:phone", authenticateUserJWT, getRewardHistory); 
router.post("/favorites/:phone", authenticateUserJWT, addFavoriteCafe);
router.get("/favorites/:phone", authenticateUserJWT, getFavoriteCafes);
router.get("/leaderboard", getLeaderboard); 
router.get('/test-email', testEmail);

router.get("/announcements", getActiveAnnouncements);

router.post('/contact-us', authenticateUserJWT, submitContactForm);

module.exports = router;