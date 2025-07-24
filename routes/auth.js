const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
router.post('/signup', async (req, res) => {
    const { email, password, username, mobileNumber } = req.body;
    if (!email || !password || !username || !mobileNumber) {
        return res.status(400).json({ error: true, message: 'All fields are required' });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: true, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            phone: mobileNumber,
            submissions: [],
            status: 'not started'
        });
        await newUser.save();
        return res.status(201).json({
            error: false,
            message: 'User registered successfully',
            userId: newUser._id
        });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: true, message: 'Internal server error' });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: true, message: 'Email and password are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: true, message: 'Invalid credentials' });
        }
        return res.status(200).json({
            error: false,
            message: 'Login successful',
            userId: user._id,
            user: {
                email: user.email,
                username: user.username,
                mobileNumber: user.phone,
                status: user.status
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: true, message: 'Internal server error' });
    }
});
module.exports = router;
