// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Method to compare hashed passwords for local authentication
UserSchema.methods.matchPassword = async function (enteredPassword) {
  console.log("Entered Password:", enteredPassword); // Debugging log
  console.log("Stored Password:", this.password); // Debugging log
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash the password if it's modified or new
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
