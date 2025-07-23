const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  examId: String,
  score: Number,
  total: Number,
  status: String,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: Array,
});

module.exports = mongoose.model('Submission', submissionSchema);
