// server/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
