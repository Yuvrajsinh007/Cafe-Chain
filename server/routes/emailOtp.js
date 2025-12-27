// routes/emailOtpRoutes.js

const express = require("express");
const router = express.Router();
const { verifyEmailOtp, resendEmailOtp } = require("../controllers/emailOtpController");

router.post("/verify-email-otp", verifyEmailOtp);
router.post("/resend-email-otp", resendEmailOtp);

module.exports = router;