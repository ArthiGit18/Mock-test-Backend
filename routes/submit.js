const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const fs = require('fs');
const path = require('path');
const questionsPath = path.join(__dirname, '../data/questions.json');
router.post('/', async (req, res) => {
  try {
    const { email, answers = [], examId } = req.body;
    if (!email || !examId) {
      return res.status(400).json({ error: true, message: 'Email and examId are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: true, message: 'User not registered.' });
    }
    if (!fs.existsSync(questionsPath)) {
      return res.status(500).json({ error: true, message: 'Questions file not found.' });
    }
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
    const examQuestions = questionsData[examId];
    if (!examQuestions) {
      return res.status(404).json({ error: true, message: 'Invalid exam ID.' });
    }
    const allQuestions = Object.values(examQuestions).flat();
    const total = allQuestions.length;
    let score = 0;
    let answeredCount = 0;
    answers.forEach((ans, idx) => {
      const correctAnswer = allQuestions[idx]?.answer;
      if (ans && ans.answer && ans.answer.trim() !== '') {
        answeredCount++;
        if (correctAnswer && correctAnswer !== 'Open-ended' && ans.answer === correctAnswer) {
          score++;
        }
      }
    });
    let status = 'not_started';
    if (answeredCount === 0) {
      status = 'not_started';
    } else if (answeredCount < total) {
      status = 'partially_completed';
    } else {
      status = 'completed';
    }
    const submission = new Submission({
      examId,
      user: user._id,
      answers,
      score,
      total,
      status,
    });
    await submission.save();
    user.submissions.push(submission._id);
    user.status = status;
    await user.save();
    return res.status(200).json({
      error: false,
      message: 'Test submitted successfully.',
      submissionId: submission._id,
      status,
      score,
      total,
    });
  } catch (err) {
    console.error('Submit Error:', err);
    return res.status(500).json({ error: true, message: 'Internal server error.' });
  }
});
module.exports = router;
