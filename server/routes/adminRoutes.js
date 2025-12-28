const express = require("express");
const router = express.Router();
const { protectAdmin } = require('../middlewares/authAdminMiddleware');
// Ensure all these functions are correctly exported from the controller
const { 
    registerAdmin,
    loginAdmin,
    adminExists,
    getPendingClaims, 
    approveClaim, 
    rejectClaim, 
    getPendingCafes,
    getAllUsers,
    getUserProfile,
    getAllCafes,
    getCafeDetails,
    approveCafe,
    rejectCafe,
    createEvent,
    getContactSubmissions,
    deleteContactSubmission,
    deleteAllContactSubmissions,
    getDashboardStats,
    createAnnouncement, 
    deleteAnnouncement
} = require("../controllers/adminController");
const upload = require('../middlewares/multerUpload'); 

router.get("/exists", adminExists);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.use(protectAdmin);

router.get("/stats", getDashboardStats);

// --- Reward Claim Routes ---
router.get("/claims/pending", getPendingClaims);
router.put("/claims/:id/approve", approveClaim);
router.put("/claims/:id/reject", rejectClaim);

router.get("/users/all", getAllUsers);
router.get("/users/:id", getUserProfile);

// ✅ FIXED: Place the specific 'pending' route before the generic ':id' route
router.get("/cafes/pending", getPendingCafes);
router.get("/cafes/all", getAllCafes);
router.get("/cafes/:id", getCafeDetails);

// --- Cafe Approval Routes ---
router.put("/cafes/:id/approve", approveCafe);
router.delete("/cafes/:id/reject", rejectCafe);

router.post("/events", upload.single('image'), createEvent);

router.post("/announcements", createAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

router.get('/contact-submissions', getContactSubmissions);
router.delete('/contact-submissions/:id', deleteContactSubmission);
router.delete('/contact-submissions', deleteAllContactSubmissions);

module.exports = router;