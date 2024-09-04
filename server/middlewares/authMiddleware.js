// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Not authorized, token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach user to request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = { protect };
