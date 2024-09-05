const express = require("express");
const router = express.Router();
const passport = require("../config/passportConfig"); // Import your passport configuration
const Productivity = require("../models/Productivity"); // Import Productivity model

// @route   POST /api/saveProductivity
// @desc    Save user productivity data
// @access  Private
router.post(
  "/saveProductivity",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { sessionTime } = req.body; // Get session time from request body

    try {
      // Create a new productivity entry with the user's ID
      const productivityData = new Productivity({
        userId: req.user._id, // Use the authenticated user's ID
        sessionTime,
      });

      // Save productivity data to the database
      await productivityData.save();

      res
        .status(201)
        .json({ message: "Productivity data saved successfully!" });
    } catch (error) {
      console.error("Failed to save productivity data:", error);
      res
        .status(500)
        .json({ message: "Failed to save productivity data", error });
    }
  }
);

module.exports = router;
