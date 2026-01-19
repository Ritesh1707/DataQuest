const express = require('express');
const { getCourses, getLesson, submitExercise } = require('../controllers/contentController');
const { authenticateToken } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Public for now, add auth later
router.get('/courses', getCourses);
router.get('/lessons/:id', getLesson);
router.post('/exercises/submit', authenticateToken, submitExercise); // Needs Auth

module.exports = router;
