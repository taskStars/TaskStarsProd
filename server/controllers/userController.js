const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  // ... login logic here
};

// Get User Profile
const getUserProfile = async (req, res) => {
  // ... get user profile logic here
};

module.exports = { registerUser, loginUser, getUserProfile };
