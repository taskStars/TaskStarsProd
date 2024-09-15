const bcrypt = require("bcryptjs"); // Use bcryptjs for password hashing
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model

// Register Controller
const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Validate email format
    if (!email || !email.includes("@")) {
      console.log("Invalid email format:", email);
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists." });
    }

    // Create a new user; password will be hashed by pre-save hook
    const newUser = new User({
      email: email.trim(),
      password: password, // The password is in plain text; it will be hashed by the pre-save hook
      name: name || "", // Store name if provided
    });

    await newUser.save();
    console.log("New user registered with hashed password:", newUser); // Debugging log
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email format
    if (!email || !email.includes("@")) {
      console.log("Invalid email format:", email);
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Find user by email
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      console.log("No user found with email:", email);
      return res.status(400).json({ message: "Invalid credentials" }); // User not found
    }

    // Compare the password using async method with the `matchPassword` method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(400).json({ message: "Invalid credentials" }); // Password mismatch
    }

    // Generate JWT token
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Login successful. Token generated."); // Debugging log
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
