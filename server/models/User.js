const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Use bcryptjs instead of bcrypt

const UserSchema = new mongoose.Schema(
  {
    // Social Login IDs (Optional for Social Authentication)
    googleId: { type: String, unique: true, sparse: true }, // Unique Google ID for OAuth
    githubId: { type: String, unique: true, sparse: true }, // Unique GitHub ID for OAuth (if using GitHub)

    // Common User Fields
    username: { type: String }, // Username for the user
    name: { type: String, required: false }, // Optional user name
    email: { type: String, required: true, unique: true }, // User's email, required and unique
    password: { type: String, required: false }, // Hashed password for local authentication (optional if using OAuth)
    image: { type: String }, // Optional field for storing profile image URL
    provider: { type: String }, // Optional field to store the provider (e.g., 'google', 'github', 'local')

    // Friends List (Reference to Other Users)
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // References to other users as friends

    // Additional Fields
    createdAt: { type: Date, default: Date.now }, // Automatically managed by Mongoose
    updatedAt: { type: Date, default: Date.now }, // Automatically managed by Mongoose
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Method to compare hashed passwords for local authentication
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

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
