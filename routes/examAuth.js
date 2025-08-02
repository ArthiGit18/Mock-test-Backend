const express = require('express');
const router = express.Router();
const User = require('../models/User');
router.post('/verify', async (req, res) => {
  const { email, examId, username, password } = req.body;
  if (!email || !examId || !username || !password) {
    return res.status(400).json({ error: true, message: 'All fields are required' });
  }
  try {
    const user = await User.findOne({ email, examId, username });
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found or exam not registered' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: true, message: 'Incorrect password' });
    }
    if (user.examStatus === 'disabled') {
      return res.status(403).json({ error: true, message: 'Exam access is disabled for this user' });
    }
    return res.json({ error: false, message: 'User verified' });
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ error: true, message: 'Server error during verification' });
  }
});
module.exports = router;
