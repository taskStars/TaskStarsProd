const User = require("../models/User");
const Task = require("../models/Task");
const Productivity = require("../models/Productivity") 
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

const getFriendsProductivity = async (req, res) => {
  try {
    // Find the logged-in user and populate their friends
    const user = await User.findById(req.user.id).populate('friends', 'name email');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize array to hold friends' productivity data
    const friendsProductivity = [];

    // Loop through each friend and fetch their productivity data
    for (const friend of user.friends) {
      // Fetch all productivity sessions for this friend
      const productivitySessions = await Productivity.find({ userId: friend._id });

      // Sum up the sessionTime for all sessions
      const totalProductivityTime = productivitySessions.reduce((acc, session) => {
        return acc + session.sessionTime;
      }, 0);

      friendsProductivity.push({
        id: friend._id,
        name: friend.name,
        productivityTime: totalProductivityTime, // Total productivity time in seconds
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
    // Log the received email and authenticated user
    console.log("Received Friend Email:", email);
    console.log("Authenticated User:", req.user);

    // Check if req.user exists
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not authenticated' });
    }

    // Check if the email is provided
    if (!email) {
      return res.status(400).json({ message: 'Friend email is required.' });
    }

    // Check if the user is trying to add themselves
    const user = await User.findById(req.user.id);
    if (user.email === email) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend.' });
    }

    // Find the friend by their email
    const friend = await User.findOne({ email });
    
    // Log friend search result
    console.log("Found Friend:", friend);

    // If the friend is not found, return an error
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Check if the friend is already added
    const isAlreadyFriend = user.friends.some(f => f.toString() === friend._id.toString());
    console.log("Is Already Friend:", isAlreadyFriend);

    if (isAlreadyFriend) {
      return res.status(400).json({ message: 'Friend already added' });
    }

    // Add the friend to the authenticated user's friend list
    user.friends.push(friend._id);
    await user.save();

    res.status(200).json({ message: 'Friend added successfully', friend });
  } catch (error) {
    console.error("Error adding friend:", error.message);
    res.status(500).json({ message: 'Error adding friend', error: error.message });
  }
};


// Search users by name or email
const searchUsers = async (req, res) => {
  const { query } = req.query;
  
  try {
    // Find users matching the search query (name or email)
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    }).select("-password"); // Exclude the password from the results

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching for users." });
  }
};


module.exports = { registerUser, loginUser, getUserProfile, getFriendsProductivity, addFriend, searchUsers, };
