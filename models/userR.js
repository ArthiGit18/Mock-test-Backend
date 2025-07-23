const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: 'Not started' }
});

module.exports = mongoose.model('LoginUser', userSchema);
