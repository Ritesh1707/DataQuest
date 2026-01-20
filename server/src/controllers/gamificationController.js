const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserRank = async (req, res) => {
  const userId = req.user.id; // From authMiddleware
  try {
    // For a hackathon/small scale, fetching all IDs is fine. 
    // For prod, we'd count documents with XP > userXP.
    const allUsers = await prisma.user.findMany({
      select: { id: true },
      orderBy: { xp: 'desc' }
    });
    
    const rank = allUsers.findIndex(u => u.id === userId) + 1;
    res.json({ rank: rank > 0 ? rank : allUsers.length, total: allUsers.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching rank' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      take: 10,
      orderBy: { xp: 'desc' },
      select: {
        id: true,
        name: true,
        xp: true,
        level: true,
        badges: true // Assuming we might iterate
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

const getAchievements = async (req, res) => {
  const userId = req.user.id;
  try {
    const [allBadges, userBadges] = await Promise.all([
      prisma.badge.findMany(),
      prisma.userBadge.findMany({ where: { userId } })
    ]);

    const unlockedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

    const achievements = allBadges.map(badge => ({
      ...badge,
      unlocked: unlockedBadgeIds.has(badge.id),
      unlockedAt: userBadges.find(ub => ub.badgeId === badge.id)?.awardedAt || null
    }));

    res.json(achievements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching achievements' });
  }
};

module.exports = { getLeaderboard, getUserRank, getAchievements };
