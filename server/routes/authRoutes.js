const express = require("express");
const passport = require("passport");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Register route
router.post("/register", registerUser);

// Local Login route
router.post("/login", loginUser);

// Google OAuth route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token } = req.user;
    if (token) {
      res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`);
    } else {
      res.redirect(`${FRONTEND_URL}/login?error=TokenMissing`);
    }
  }
);

// GitHub OAuth route
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub OAuth callback route
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const { token } = req.user;
    if (token) {
      res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`);
    } else {
      res.redirect(`${FRONTEND_URL}/login?error=TokenMissing`);
    }
  }
);

module.exports = router;
