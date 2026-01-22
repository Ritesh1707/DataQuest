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


const getStats = async (req, res) => {
  const userId = req.user.id;
  try {
    const completedProgress = await prisma.userProgress.findMany({
      where: { 
        userId, 
        status: 'COMPLETED',
        completedAt: { not: null }
      },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true
              }
            }
          }
        }
      }
    });

    // 1. Activity Heatmap (Last 365 days)
    const heatmapData = {};
    completedProgress.forEach(p => {
      const date = p.completedAt.toISOString().split('T')[0];
      heatmapData[date] = (heatmapData[date] || 0) + 1;
    });

    const activityHeatmap = Object.entries(heatmapData).map(([date, count]) => ({ date, count }));

    // 2. Skill Radar (Based on Course Titles for now)
    const skillCounts = {};
    completedProgress.forEach(p => {
      // Use course title or fallback to "General"
      const skill = p.lesson?.module?.course?.title || 'General';
      skillCounts[skill] = (skillCounts[skill] || 0) + 10; // Assume 10 points per lesson
    });

    // Normalize slightly for radar chart (max 100 or just raw values)
    const skillRadar = Object.entries(skillCounts).map(([subject, A]) => ({ subject, A, fullMark: 100 }));
    
    // Ensure we have at least some data for the radar
    if (skillRadar.length === 0) {
        skillRadar.push({ subject: 'Coding', A: 0, fullMark: 100 });
        skillRadar.push({ subject: 'Data', A: 0, fullMark: 100 });
        skillRadar.push({ subject: 'AI', A: 0, fullMark: 100 });
    }

    res.json({
      heatmap: activityHeatmap,
      radar: skillRadar
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

module.exports = { getLeaderboard, getUserRank, getAchievements, getStats };
