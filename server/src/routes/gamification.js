const express = require('express');
const { getLeaderboard, getUserRank } = require('../controllers/gamificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/my-rank', authenticateToken, getUserRank);

module.exports = router;
