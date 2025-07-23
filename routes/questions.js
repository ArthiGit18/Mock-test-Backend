const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.post('/:id', (req, res) => {
  const secret = req.headers['secret'];
  if (secret !== process.env.SECRET_KEY) {
    return res.status(403).json({ error: true, message: 'Unauthorized' });
  }

  const user = req.body.user;
  if (!user || !user.name || !user.email) {
    return res.status(400).json({ error: true, message: 'User data missing' });
  }

  const filePath = path.join(__dirname, '../data/questions.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: true, message: 'Server error' });

    try {
      const questionsData = JSON.parse(data);
      const sectionedQuestions = questionsData[req.params.id];

      if (!sectionedQuestions) {
        return res.status(404).json({ error: true, message: 'Exam not found' });
      }

      // Flatten the sectioned questions into a single array
      const allQuestions = Object.values(sectionedQuestions)
        .flat()
        .map((q) => ({
          question: q.question,
          options: q.options || [],
          correct: q.answer // to keep consistent with frontend expecting `correct`
        }));

      res.json({
        error: false,
        message: `Welcome ${user.name}`,
        questions: allQuestions
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: true, message: 'Invalid JSON' });
    }
  });
});


module.exports = router;
