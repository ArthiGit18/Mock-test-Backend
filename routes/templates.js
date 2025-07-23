const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const secret = req.headers['secret'];
  if (secret !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: true, message: 'Unauthorized' });
  }

  const filePath = path.join(__dirname, '../data/templates.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: true, message: 'Server error' });

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch {
      res.status(500).json({ error: true, message: 'Invalid JSON' });
    }
  });
});

module.exports = router;
