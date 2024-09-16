const mongoose = require("mongoose");

const ProductivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionTime: { type: Number, required: true }, 
  sessionDate: { type: Date, default: Date.now },
});

const Productivity =
  mongoose.models.Productivity ||
  mongoose.model("Productivity", ProductivitySchema);
module.exports = Productivity;
