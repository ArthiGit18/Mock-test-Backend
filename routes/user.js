const express = require('express');
const router = express.Router();
const User = require('../models/User');
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ error: false, users });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});
router.put('/users/:id/status', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { status: 'Completed' }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    res.json({ error: false, message: 'Status updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }
    res.json({ error: false, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});
module.exports = router;
