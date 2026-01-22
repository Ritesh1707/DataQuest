const express = require('express');
const { getQuiz, submitQuiz } = require('../controllers/quizController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', authenticateToken, getQuiz);
router.post('/:id/submit', authenticateToken, submitQuiz);

module.exports = router;
