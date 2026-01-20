const { MongoClient } = require('mongodb');

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/hackathon';
// Extract db name from URL if possible, or default to 'hackathon'
// Simplify: Just use the hardcoded localhost url + db name pattern if env is complex
// But let's try to be smart.
const dbName = 'hackathon';
const clientUrl = 'mongodb://localhost:27017'; 

const badges = [
  {
    name: "First Contact",
    description: "Completed your first lesson.",
    condition: "first_lesson",
    imageUrl: "https://api.iconify.design/lucide:rocket.svg?color=%23FF3621"
  },
  {
    name: "Void Walker",
    description: "Completed an entire course.",
    condition: "course_complete",
    imageUrl: "https://api.iconify.design/lucide:orbit.svg?color=%23FF3621"
  },
  {
    name: "Code Artificer",
    description: "Successfully submitted 5 coding exercises.",
    condition: "5_exercises",
    imageUrl: "https://api.iconify.design/lucide:code-2.svg?color=%23FF3621"
  },
  {
    name: "Nebula Surfer",
    description: "Logged in for 7 consecutive days.",
    condition: "7_day_streak",
    imageUrl: "https://api.iconify.design/lucide:flame.svg?color=%23FF3621"
  },
  {
    name: "Bug Hunter",
    description: "Fixed code after a failed attempt.",
    condition: "fix_error",
    imageUrl: "https://api.iconify.design/lucide:bug-off.svg?color=%23FF3621"
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
