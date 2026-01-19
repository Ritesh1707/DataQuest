const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

// URL from .env
const url = 'mongodb://localhost:27017';
const dbName = 'hackathon';

async function main() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    // Collections
    const courses = db.collection('Course');
    const modules = db.collection('Module');
    const lessons = db.collection('Lesson');
    const exercises = db.collection('Exercise');
    const users = db.collection('User');

    // Clean (optional)
    try {
      await courses.deleteMany({});
      await modules.deleteMany({});
      await lessons.deleteMany({});
      await exercises.deleteMany({});
      await users.deleteMany({});
    } catch (e) { console.log('Clean error', e); }

    // Create Course
    const courseResult = await courses.insertOne({
      title: 'Databricks Fundamentals',
      description: 'Master the basics of Databricks and Apache Spark.',
      slug: 'databricks-101',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const courseId = courseResult.insertedId;
    console.log('Course created:', courseId);

    // Create Module
    const moduleResult = await modules.insertOne({
      title: 'Introduction to Spark',
      order: 1,
      courseId: courseId, // Object Id reference
    });
    const moduleId = moduleResult.insertedId;
    console.log('Module created:', moduleId);

    // Create Lesson
    const lessonResult = await lessons.insertOne({
      title: 'SparkContext & RDDs',
      content: '# SparkContext\n\nThe entry point to Spark functionality.',
      order: 1,
      moduleId: moduleId,
    });
    const lessonId = lessonResult.insertedId;
    console.log('Lesson created:', lessonId);

    // Create Exercise
    await exercises.insertOne({
      prompt: 'Create a Resilient Distributed Dataset (RDD) from a list of numbers [1, 2, 3].',
      starterCode: '// Type code here\n',
      solution: 'sc.parallelize',
      order: 1,
      lessonId: lessonId,
    });
    console.log('Exercise created');

    const badgesCollection = db.collection('Badge');
    await badgesCollection.deleteMany({});
    
    // Create Badges
    await badgesCollection.insertMany([
        {
            name: 'Spark Novice',
            description: 'Earned your first 10 XP!',
            condition: 'xp_10',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/5778/5778385.png', // Placeholder
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Code Warrior',
            description: 'Reached 100 XP',
            condition: 'xp_100',
            imageUrl: 'https://cdn-icons-png.flaticon.com/512/5778/5778432.png',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
    console.log('Badges created');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('password', 10);
    await users.insertOne({
        email: 'admin@hackathon.com',
        password: hashedPassword,
        name: 'Admin User',
        xp: 0,
        level: 1,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
    });

  } catch (err) {
    console.error(err.stack);
  } finally {
    await client.close();
  }
}

main();
