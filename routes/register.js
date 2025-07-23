const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  const secret = req.headers['secret'];
  if (secret !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: true, message: 'Unauthorized' });
  }

  const { username, password, email, phone, gender, age, examId } = req.body;

  if (!username || !password || !email || !phone || !gender || !age || !examId) {
    return res.status(400).json({ error: true, message: 'Missing fields' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ 
        error: true, 
        message: 'User already registered', 
        status: existingUser.status 
      });
    }

    const newUser = new User({
      username,
      password,
      email,
      phone,
      gender,
      age,
      examId
    });

    await newUser.save();

    res.status(201).json({ 
      error: false, 
      message: 'User registered successfully', 
      status: 'registered' 
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const secret = req.headers['secret'];
    if (secret !== process.env.SECRET_KEY) {
      return res.status(403).json({ error: true, message: 'Unauthorized' });
    }

    const users = await User.find();
    res.status(200).json({ error: false, data: users });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const secret = req.headers['secret'];
    if (secret !== process.env.SECRET_KEY) {
      return res.status(403).json({ error: true, message: 'Unauthorized' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ error: false, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Server error' });
  }
});



module.exports = router;
