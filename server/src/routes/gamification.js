const express = require('express');
const { getLeaderboard, getUserRank, getAchievements, getStats } = require('../controllers/gamificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/my-rank', authenticateToken, getUserRank);
router.get('/achievements', authenticateToken, getAchievements);
router.get('/stats', authenticateToken, getStats);

module.exports = router;
