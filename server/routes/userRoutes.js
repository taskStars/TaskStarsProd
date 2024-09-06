const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getFriendsProductivity,
  addFriend, searchUsers
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

//api/users/test
router.get("/test", (req, res) => {
  res.json({ message: "API is working properly!" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addFriend", protect, addFriend);
router.get("/profile", getUserProfile); // Remove `protect` middleware temporarily
router.get("/friendsProductivity", protect, getFriendsProductivity);
router.get("/search", protect, searchUsers);

module.exports = router;
