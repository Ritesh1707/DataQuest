const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Protect this route so only logged-in users can use tokens
router.post('/analyze-code', authenticateToken, aiController.analyzeCode);

module.exports = router;
