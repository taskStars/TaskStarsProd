const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getFriendsProductivity,
  addFriend,
  searchUsers,
  getUserProductivity,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

//api/users/test
router.get("/test", (req, res) => {
  res.json({ message: "API is working properly!" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addFriend", protect, addFriend);
router.get("/profile", getUserProfile); 
router.get("/friendsProductivity", protect, getFriendsProductivity);
router.get("/search", protect, searchUsers);
router.get("/productivity", protect, getUserProductivity);

module.exports = router;
