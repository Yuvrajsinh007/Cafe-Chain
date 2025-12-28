require("dotenv").config();
require("./cron");

const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// --- Route Imports ---
const userRoutes = require("./routes/users");
const emailOtpRoutes = require("./routes/emailOtp");
const rewardRoutes = require("./routes/rewardRoutes");
const cafeRoutes = require("./routes/cafeRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cafeOwnerRoutes = require("./routes/cafeOwnerRoutes");
const { authenticateUserJWT } = require("./middlewares/auth");
const eventRoutes = require('./routes/eventRoutes');
const { startEventCleanupJob } = require('./jobs/eventCleanup');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Database Connection ---
connectDB();

// ✅ CRITICAL: Add your Vercel domain here
const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "https://cafe-chain.vercel.app" // Your Vercel Frontend URL
];

// --- Core Middleware ---
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow methods
    allowedHeaders: ["Content-Type", "Authorization"] // Explicitly allow headers
}));

// It allows the server to understand the JSON data sent from your frontend.
app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API ROUTES ---
app.use("/api/users", userRoutes);
app.use("/api/email-otp", emailOtpRoutes);
app.use("/api/rewards", authenticateUserJWT, rewardRoutes);
app.use("/api/cafes", cafeRoutes);
app.use("/api/forgot-password", forgotPasswordRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cafe-owner", cafeOwnerRoutes);
app.use('/api/events', eventRoutes);

app.use((err, req, res, next) => {
    console.error("UNHANDLED ERROR:", err);
    res.status(500).send({ error: 'Something went wrong on the server!' });
});

startEventCleanupJob();

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});