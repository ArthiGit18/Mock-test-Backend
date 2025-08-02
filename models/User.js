const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  gender: String,
  age: Number,
  examId: String,

  score: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  status: { type: String, enum: ['pending', 'partially completed', 'completed'], default: 'pending' },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
});

module.exports = mongoose.model('User', userSchema);
