const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'hackathon';

async function main() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected to server for Progress Seeding');
    const db = client.db(dbName);

    const usersCollection = db.collection('User');
    const lessonsCollection = db.collection('Lesson');
    const progressCollection = db.collection('UserProgress');

    // Get all users and lessons
    const users = await usersCollection.find({}).toArray();
    const lessons = await lessonsCollection.find({}).toArray();

    if (users.length === 0 || lessons.length === 0) {
      console.log('No users or lessons found. Please seed them first.');
      return;
    }

    console.log(`Found ${users.length} users and ${lessons.length} lessons.`);

    // Clear existing progress to avoid orphaned records from previous seeds
    await progressCollection.deleteMany({}); 

    const progressEntries = [];
    const timestamp = new Date();

    for (const user of users) {
      // Determine a "persona" for the user to make data look realistic
      // e.g. 30% chance of being a "Power User" (completed most things)
      const completionRate = Math.random() > 0.7 ? 0.8 : 0.3; 
      
      const completedCount = Math.floor(lessons.length * completionRate);
      
      // Shuffle lessons to pick random ones
      const shuffledLessons = lessons.sort(() => 0.5 - Math.random());
      const userLessons = shuffledLessons.slice(0, completedCount);

      for (const lesson of userLessons) {
        // Avoid duplicate key error physically in array, though mongo insertMany ignores duplicates with ordered:false usually or we check db.
        // Better: just prepare objects.
        
        // We need to check if it exists or we just rely on deleteMany above. 
        // Let's rely on deleteMany for clean state or use bulkWrite with upsert.
        // For simplicity in this seed script, let's just delete stats for these users first? 
        // Nah, let's use insertOne with error catching or just bulkWrite.
        
        progressEntries.push({
            updateOne: {
                filter: { userId: user._id, lessonId: lesson._id },
                update: { 
                    $set: { 
                        userId: user._id,
                        lessonId: lesson._id,
                        status: 'COMPLETED',
                        completedAt: new Date(timestamp.getTime() - Math.random() * 1000000000) // Random time in past
                    } 
                },
                upsert: true
            }
        });
      }
    }

    if (progressEntries.length > 0) {
        console.log(`Writing ${progressEntries.length} progress records...`);
        await progressCollection.bulkWrite(progressEntries);
        console.log('Progress seeded successfully!');
    }

    // Also update XP for users based on progress
    console.log('Updating User XP...');
    for (const user of users) {
        const userProgressCount = await progressCollection.countDocuments({ userId: user._id, status: 'COMPLETED' });
        const newXp = userProgressCount * 10; // 10 XP per lesson
        const newLevel = Math.floor(newXp / 100) + 1; // Simple level formula

        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { xp: newXp, level: newLevel } }
        );
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
