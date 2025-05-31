const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: err.message, 
    });
  }
};

module.exports = authMiddleware;
