const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !email.includes("@")) {
      console.log("Invalid email format:", email);
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists." });
    }

    
    const newUser = new User({
      email: email.trim(),
      password: password, 
      name: name || "", 
    });

    await newUser.save();
    console.log("New user registered with hashed password:", newUser); 
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    if (!email || !email.includes("@")) {
      console.log("Invalid email format:", email);
      return res.status(400).json({ message: "Invalid email format." });
    }

    
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      console.log("No user found with email:", email);
      return res.status(400).json({ message: "Invalid credentials" }); 
    }

    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(400).json({ message: "Invalid credentials" }); 
    }

    
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Login successful. Token generated."); 
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
