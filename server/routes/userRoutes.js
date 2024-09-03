const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

//api/users/test
router.get("/test", (req, res) => {
  res.json({ message: "API is working properly!" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile); // Remove `protect` middleware temporarily

module.exports = router;
