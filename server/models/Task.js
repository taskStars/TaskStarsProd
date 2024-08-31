const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  lockInTime: { type: Number, default: 0 }, // Time in minutes
});

module.exports = mongoose.model('Task', TaskSchema);