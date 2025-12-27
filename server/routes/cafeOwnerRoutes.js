const express = require("express");
const router = express.Router();
const { 
  requestCafeEmailOTP, 
  verifyCafeEmailOTP,
  loginCafe,
  getCafeProfile,
  addCafeImage,
  deleteCafeImage,
  updateCafeProfile,
  // setupProfile,
  getActivityLog,
  getLoyaltyProgramMetrics,
  getCafeDashboardAnalytics,
  getCustomerPointsForCafe,
  initiateRedemption,
  verifyRedemption,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword, 
  getOffers,
  addOffer,
  deleteOffer,
  // updateOffer,
  submitContactForm
} = require("../controllers/cafeOwnerController");

const { authenticateCafeOwnerJWT } = require("../middlewares/cafeAuth");

// --- Onboarding and Authentication Routes ---
router.post("/register/request-otp", requestCafeEmailOTP);
router.post("/register/verify-otp", verifyCafeEmailOTP);
router.post("/login", loginCafe);


// --- Profile & Image Management (Protected) ---
router.get("/profile", authenticateCafeOwnerJWT, getCafeProfile);
router.put("/profile", authenticateCafeOwnerJWT, updateCafeProfile); 
router.post("/images/add", authenticateCafeOwnerJWT, addCafeImage);
router.post("/images/delete", authenticateCafeOwnerJWT, deleteCafeImage);
// CRITICAL CHANGE: This route is now protected by our new, temporary onboarding middleware.
// This ensures only users who have just verified their OTP can access this.
// router.put("/setup-profile", authenticateOnboardingJWT, setupProfile);

// --- Analytics (Protected by permanent login) ---
// This route remains unchanged and requires a fully logged-in and approved cafe owner.
router.get("/analytics/summary", authenticateCafeOwnerJWT, getCafeDashboardAnalytics);

// --- Rewards & Redemption (Protected by permanent login) ---
// These routes also remain unchanged.
router.post('/customer-points', authenticateCafeOwnerJWT, getCustomerPointsForCafe);
router.post("/redemption/initiate", authenticateCafeOwnerJWT, initiateRedemption);
router.post("/redemption/verify", authenticateCafeOwnerJWT, verifyRedemption);
router.get("/analytics/loyalty", authenticateCafeOwnerJWT, getLoyaltyProgramMetrics);
router.get("/activity-log", authenticateCafeOwnerJWT, getActivityLog);

// --- NEW FORGOT PASSWORD ROUTES ---
router.post("/password/request-reset", requestPasswordReset);
router.post("/password/verify-otp", verifyPasswordResetOTP);
router.post("/password/reset", resetPassword);

// --- Loyalty Offer Management (Protected) ---
router.get("/offers", authenticateCafeOwnerJWT, getOffers);
router.post("/offers", authenticateCafeOwnerJWT, addOffer);
router.delete("/offers/:offerId", authenticateCafeOwnerJWT, deleteOffer);
// router.put("/offers/:offerId", authenticateCafeOwnerJWT, updateOffer);


router.post('/contact-us', authenticateCafeOwnerJWT, submitContactForm);

module.exports = router;