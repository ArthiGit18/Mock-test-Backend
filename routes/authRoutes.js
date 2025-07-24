const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userR');
router.post('/signup', async (req, res) => {
  try {
    const { email, password, username, phone } = req.body;
    if (!email || !password || !username || !phone) {
      return res.status(400).json({ error: true, message: "Missing fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: true, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username, phone });
    await user.save();
    res.status(201).json({ error: false, message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Missing email or password' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: true, message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: true, message: 'Invalid email or password' });
    }
    return res.status(200).json({ error: false, message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Server error' });
  }
});
module.exports = router;
