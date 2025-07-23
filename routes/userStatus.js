// routes/userStatus.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  const { email, status } = req.body;

  if (!email || !status) {
    return res.status(400).json({ error: true, message: 'Email and status required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ error: false, message: 'Status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

module.exports = router;
