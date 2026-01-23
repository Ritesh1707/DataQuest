const { MongoClient } = require('mongodb');

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/hackathon';
// Extract db name from URL if possible, or default to 'hackathon'
// Simplify: Just use the hardcoded localhost url + db name pattern if env is complex
// But let's try to be smart.
const dbName = 'hackathon';
const clientUrl = 'mongodb://localhost:27017'; 

const badges = [
  // Original Badges
  {
    name: "First Contact",
    description: "Completed your first lesson.",
    condition: "first_lesson",
    rarity: "common",
    imageUrl: "https://api.iconify.design/lucide:rocket.svg?color=%23FF3621"
  },
  {
    name: "Void Walker",
    description: "Completed an entire course.",
    condition: "course_complete",
    rarity: "rare",
    imageUrl: "https://api.iconify.design/lucide:orbit.svg?color=%23FF3621"
  },
  {
    name: "Code Artificer",
    description: "Successfully submitted 5 coding exercises.",
    condition: "5_exercises",
    rarity: "common",
    imageUrl: "https://api.iconify.design/lucide:code-2.svg?color=%23FF3621"
  },
  {
    name: "Nebula Surfer",
    description: "Logged in for 7 consecutive days.",
    condition: "7_day_streak",
    rarity: "epic",
    imageUrl: "https://api.iconify.design/lucide:flame.svg?color=%23FF3621"
  },
  {
    name: "Bug Hunter",
    description: "Fixed code after a failed attempt.",
    condition: "fix_error",
    rarity: "common",
    imageUrl: "https://api.iconify.design/lucide:bug-off.svg?color=%23FF3621"
  },
  
  // Difficulty-Based Badges
  {
    name: "Beginner's Luck",
    description: "Complete 3 BEGINNER level courses.",
    condition: "beginner_3",
    rarity: "common",
    imageUrl: "https://api.iconify.design/lucide:star.svg?color=%2310B981"
  },
  {
    name: "Rising Star",
    description: "Complete 2 INTERMEDIATE level courses.",
    condition: "intermediate_2",
    rarity: "rare",
    imageUrl: "https://api.iconify.design/lucide:trending-up.svg?color=%23F59E0B"
  },
  {
    name: "Master Architect",
    description: "Complete 1 ADVANCED level course.",
    condition: "advanced_1",
    rarity: "epic",
    imageUrl: "https://api.iconify.design/lucide:crown.svg?color=%23EF4444"
  },
  {
    name: "Polymath",
    description: "Complete at least 1 course from each difficulty level.",
    condition: "all_difficulties",
    rarity: "legendary",
    imageUrl: "https://api.iconify.design/lucide:trophy.svg?color=%23FFD700"
  },
  
  // Technology-Based Badges
  {
    name: "Python Prodigy",
    description: "Complete 5 lessons with Python tag.",
    condition: "python_5",
    rarity: "rare",
    imageUrl: "https://api.iconify.design/logos:python.svg"
  },
  {
    name: "SQL Sorcerer",
    description: "Complete 5 lessons with SQL tag.",
    condition: "sql_5",
    rarity: "rare",
    imageUrl: "https://api.iconify.design/lucide:database.svg?color=%234169E1"
  },
  {
    name: "Spark Specialist",
    description: "Complete 5 lessons with Spark/PySpark tag.",
    condition: "spark_5",
    rarity: "epic",
    imageUrl: "https://api.iconify.design/lucide:zap.svg?color=%23FF6B35"
  },
  {
    name: "ML Maverick",
    description: "Complete 5 lessons with Machine Learning tag.",
    condition: "ml_5",
    rarity: "epic",
    imageUrl: "https://api.iconify.design/lucide:brain.svg?color=%23A855F7"
  },
  {
    name: "Full Stack Data Engineer",
    description: "Complete lessons across 5+ different technology tags.",
    condition: "tech_diversity_5",
    rarity: "legendary",
    imageUrl: "https://api.iconify.design/lucide:layers.svg?color=%23FFD700"
  },
  
  // Engagement-Based Badges
  {
    name: "Speed Demon",
    description: "Complete 3 lessons in one day.",
    condition: "speed_3",
    rarity: "rare",
    imageUrl: "https://api.iconify.design/lucide:gauge.svg?color=%23FF3621"
  },
  {
    name: "Night Owl",
    description: "Complete a lesson between 12 AM - 5 AM.",
    condition: "night_owl",
    rarity: "rare",
    imageUrl: "https://api.iconify.design/lucide:moon.svg?color=%236366F1"
  },
  {
    name: "Weekend Warrior",
    description: "Complete 5 lessons on weekends.",
    condition: "weekend_5",
    rarity: "epic",
    imageUrl: "https://api.iconify.design/lucide:calendar.svg?color=%2310B981"
  }
];

async function seedBadges() {
  const client = new MongoClient(clientUrl);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const badgeCollection = db.collection('Badge');

    for (const badge of badges) {
      const existing = await badgeCollection.findOne({ name: badge.name });
      
      if (!existing) {
        await badgeCollection.insertOne(badge);
        console.log(`Created badge: ${badge.name}`);
      } else {
        console.log(`Badge exists: ${badge.name}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

seedBadges();
