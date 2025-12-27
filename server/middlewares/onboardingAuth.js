const jwt = require("jsonwebtoken");

/**
 * This middleware is ONLY for the setup process after OTP verification.
 * It validates the temporary 'onboardingToken' which contains the initial registration data.
 */
exports.authenticateOnboardingJWT = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ error: "Access denied. No temporary session token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the temporary registration data from the token's payload to the request object
        if (decoded.temp_data) {
            req.onboardingData = decoded.temp_data;
            next();
        } else {
            throw new Error("Invalid token payload. Missing temporary data.");
        }
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired session token. Please register again." });
    }
};