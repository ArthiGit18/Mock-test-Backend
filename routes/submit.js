const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const fs = require('fs');
const path = require('path');
const questionsPath = path.join(__dirname, '../data/questions.json');


router.post('/', async (req, res) => {
  const { email, examId, score, total } = req.body;

  console.log("Incoming payload:", { email, examId, score, total });

  if (!email || !examId || score == null || total == null) {
    return res.status(400).json({ error: true, message: 'Missing required fields' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ error: true, message: 'Email not registered' });
    }

    if (existingUser.examId !== examId) {
      return res.status(400).json({ error: true, message: 'Mismatched exam ID' });
    }

    console.log("User found:", existingUser);

    existingUser.score = score;
    existingUser.total = total;
    existingUser.status = 'completed';

    await existingUser.save();
    console.log("User after save:", existingUser);

    return res.json({ error: false, message: 'Score and status updated successfully' });

  } catch (err) {
    console.error('Server error during submission:', err.message);
    console.error(err.stack);
    return res.status(500).json({ error: true, message: 'Server error during submission' });
  }
});








module.exports = router;
