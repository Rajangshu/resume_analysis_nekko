// server/authMiddleware.js
const jwt = require("jsonwebtoken");
const SECRET = "your_secret_key";

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId; // attach to request
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = requireAuth;
