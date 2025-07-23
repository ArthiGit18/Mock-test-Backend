require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'dummy-secret';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('✅ MongoDB connected'));
const userRoutes = require('./routes/user');
app.use('/api', userRoutes);
// Routes
app.use('/api/register', require('./routes/register'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/submit', require('./routes/submit'));
app.use('/api/auth', require('./routes/auth'));
app.use('/test', require('./routes/authRoutes'));
app.use('/api/results', require('./routes/results'));
app.use('/api', require('./routes/contact'));
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
