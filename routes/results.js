// routes/results.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Save result and update status if pending
router.post('/', async (req, res) => {
  const { email, score, answers } = req.body;

  if (!email || score == null || !Array.isArray(answers)) {
    return res.status(400).json({ error: true, message: 'Missing fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    // Append new submission
    user.submissions.push({
      score,
      answers,
      timestamp: new Date()
    });

    // Update status if it's still pending
    if (user.status === 'pending') {
      user.status = 'completed';
    }

    await user.save();

    res.json({ error: false, message: 'Result saved and status updated', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

module.exports = router;
