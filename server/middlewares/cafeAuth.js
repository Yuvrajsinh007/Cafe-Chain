const jwt = require("jsonwebtoken");
const Cafe = require("../models/Cafe"); // ✅ Correctly import the Cafe model

const authenticateCafeOwnerJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Make sure you are using the correct JWT_SECRET from your .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ CRITICAL CHANGE: Find the user in the 'Cafe' collection, not 'User'
    const cafeOwner = await Cafe.findById(decoded.id).select("-password");

    if (!cafeOwner) {
      return res.status(404).json({ error: "Cafe owner not found." });
    }

    // Attach the authenticated cafe owner to the request object
    req.user = cafeOwner;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired." });
    }
    console.error("JWT Verification Error:", error);
    return res.status(403).json({ error: "Invalid token." });
  }
};

module.exports = { authenticateCafeOwnerJWT };