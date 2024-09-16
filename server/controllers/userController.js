const User = require("../models/User");
const Task = require("../models/Task");
const Productivity = require("../models/Productivity");
const jwt = require("jsonwebtoken");


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


const loginUser = async (req, res) => {
  
};


const getUserProfile = async (req, res) => {
  
};

const getFriendsProductivity = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id).populate(
      "friends",
      "name email"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    const friendsProductivity = [];

    
    for (const friend of user.friends) {
      
      const productivitySessions = await Productivity.find({
        userId: friend._id,
      });

      
      const totalProductivityTime = productivitySessions.reduce(
        (acc, session) => {
          return acc + session.sessionTime;
        },
        0
      );

      friendsProductivity.push({
        id: friend._id,
        name: friend.name,
        productivityTime: totalProductivityTime, 
      });
    }

    res.status(200).json(friendsProductivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addFriend = async (req, res) => {
  const { email } = req.body;

  try {
    
    console.log("Received Friend Email:", email);
    console.log("Authenticated User:", req.user);

    
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not authenticated" });
    }

    
    if (!email) {
      return res.status(400).json({ message: "Friend email is required." });
    }

    
    const user = await User.findById(req.user.id);
    if (user.email === email) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend." });
    }

    
    const friend = await User.findOne({ email });

    
    console.log("Found Friend:", friend);

    
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    
    const isAlreadyFriend = user.friends.some(
      (f) => f.toString() === friend._id.toString()
    );
    console.log("Is Already Friend:", isAlreadyFriend);

    if (isAlreadyFriend) {
      return res.status(400).json({ message: "Friend already added" });
    }

    
    user.friends.push(friend._id);
    await user.save();

    res.status(200).json({ message: "Friend added successfully", friend });
  } catch (error) {
    console.error("Error adding friend:", error.message);
    res
      .status(500)
      .json({ message: "Error adding friend", error: error.message });
  }
};


const searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password"); 

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching for users." });
  }
};


const getUserProductivity = async (req, res) => {
  try {
    
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not authenticated" });
    }

    
    const productivitySessions = await Productivity.find({
      userId: req.user.id,
    });

    
    const totalProductivityTime = productivitySessions.reduce(
      (acc, session) => {
        return acc + session.sessionTime;
      },
      0
    );

    res.status(200).json({
      totalProductivityTime, 
      productivitySessions, 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getFriendsProductivity,
  addFriend,
  searchUsers,
  getUserProductivity,
};
