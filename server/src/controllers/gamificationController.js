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

    // 2. Tag-based Skill Aggregation
    const tagCounts = {};
    const ALL_LANGUAGES = ['Python', 'SQL', 'Scala', 'R', 'Java'];
    
    // Default zero values for key languages to ensure they appear on the chart
    ALL_LANGUAGES.forEach(lang => tagCounts[lang] = 0);

    completedProgress.forEach(p => {
      const course = p.lesson?.module?.course;
      const tags = course?.tags || [];
      
      if (tags.length > 0) {
        tags.forEach(tag => {
           tagCounts[tag] = (tagCounts[tag] || 0) + 10;
        });
      } else {
        // Fallback for untagged content
        const title = course?.title || 'General';
        tagCounts[title] = (tagCounts[title] || 0) + 10;
      }
    });

    // Split into Languages and Technologies
    const languages = [];
    const technologies = [];

    Object.entries(tagCounts).forEach(([name, score]) => {
      const entry = { name, score, fullMark: 100 }; // Normalize if needed later
      if (ALL_LANGUAGES.includes(name)) {
        languages.push(entry);
      } else {
        // Filter out course titles that might have slipped in if we want strict "Technologies"
        // For now, include everything else as a technology/skill
        if (score > 0) technologies.push(entry);
      }
    });

    // Sort by score desc
    languages.sort((a,b) => b.score - a.score);
    technologies.sort((a,b) => b.score - a.score);

    // 3. Determine Dynamic Identity (Theme)
    let topSkill = 'Novice';
    let themeColor = 'slate'; 
    let maxSkillVal = 0;

    // Check all tags for top skill
    Object.entries(tagCounts).forEach(([skill, val]) => {
      if (val > maxSkillVal) {
        maxSkillVal = val;
        topSkill = skill;
      }
    });

    if (maxSkillVal === 0) topSkill = 'Novice';

    // Theme Logic
    const ts = topSkill.toLowerCase();
    if (ts.includes('data') || ts.includes('sql')) themeColor = 'orange'; 
    else if (ts.includes('architect')) themeColor = 'blue';
    else if (ts.includes('ml') || ts.includes('ai') || ts.includes('python')) themeColor = 'purple';
    else if (ts.includes('coding') || ts.includes('spark')) themeColor = 'green';
    else themeColor = 'red'; 

    // Radar Data (Use Top 6 Tech/Skills)
    const skillRadar = technologies.slice(0, 6).map(t => ({ subject: t.name, A: t.score, fullMark: 100 }));
    if (skillRadar.length < 3) {
       ['Architecture', 'Data Engineering', 'ML'].forEach(d => {
          if (!skillRadar.find(r => r.subject === d)) skillRadar.push({ subject: d, A: 0, fullMark: 100 });
       });
    }

    res.json({
      heatmap: activityHeatmap,
      radar: skillRadar,
      techStack: {
        languages,
        technologies
      },
      identity: {
        topSkill,
        themeColor
      }
    });

  } catch (error) {
    console.error('Gamification Stats Error:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

module.exports = { getLeaderboard, getUserRank, getAchievements, getStats };
