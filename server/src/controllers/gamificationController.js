const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

module.exports = { getLeaderboard };
