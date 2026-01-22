const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'hackathon';

async function main() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected to server for Quiz Seeding');
    const db = client.db(dbName);

    const courses = db.collection('Course');
    const modules = db.collection('Module');
    const quizzes = db.collection('Quiz');
    const questions = db.collection('Question');

    // 1. Clear old Quizzes
    await quizzes.deleteMany({});
    await questions.deleteMany({});
    console.log('Cleared existing quizzes and questions.');

    // 2. Update Course Difficulties
    console.log('Updating Course Difficulties...');
    
    const saCourse = await courses.findOne({ slug: 'databricks-sa-masterclass' });
    if (saCourse) {
        await courses.updateOne({ _id: saCourse._id }, { $set: { difficulty: 'ADVANCED' } });
        console.log(`Updated ${saCourse.title} to ADVANCED`);
        
        // Find Module 1
        const saMod1 = await modules.findOne({ courseId: saCourse._id, order: 1 });
        if (saMod1) {
            // Create Quiz
            const q1 = await quizzes.insertOne({
                title: 'Lakehouse Architecture Mastery',
                description: 'Test your knowledge on Medallion Architecture and Data Quality.',
                difficulty: 'ADVANCED',
                moduleId: saMod1._id,
                createdAt: new Date()
            });
            
            // Add Questions
            await questions.insertMany([
                {
                    quizId: q1.insertedId,
                    text: 'Which layer of the Medallion Architecture is strictly append-only and stores raw data?',
                    options: ['Silver', 'Gold', 'Bronze', 'Platinum'],
                    correctAnswer: 'Bronze',
                    points: 10
                },
                {
                    quizId: q1.insertedId,
                    text: 'What is the primary purpose of the Silver layer?',
                    options: ['Raw ingestion', 'Business aggregation', 'Data cleansing and conforming', 'Machine Learning inference'],
                    correctAnswer: 'Data cleansing and conforming',
                    points: 10
                },
                {
                    quizId: q1.insertedId,
                    text: 'Which format is typically used for storage in the Lakehouse?',
                    options: ['CSV', 'Parquet/Delta', 'JSON', 'XML'],
                    correctAnswer: 'Parquet/Delta',
                    points: 10
                }
            ]);
            console.log('Created SA Quiz 1');
        }
    }

    const deCourse = await courses.findOne({ slug: 'data-engineer-associate' });
    if (deCourse) {
        await courses.updateOne({ _id: deCourse._id }, { $set: { difficulty: 'BEGINNER' } });
        console.log(`Updated ${deCourse.title} to BEGINNER`);

        // Find Module 3 (Spark SQL)
        const deMod3 = await modules.findOne({ courseId: deCourse._id, order: 2 }); // "Relational Entities..." is order 2
        if (deMod3) {
             const q2 = await quizzes.insertOne({
                title: 'Managed vs External Tables',
                description: 'Validate your understanding of table types in Databricks.',
                difficulty: 'BEGINNER',
                moduleId: deMod3._id,
                createdAt: new Date()
            });

             await questions.insertMany([
                {
                    quizId: q2.insertedId,
                    text: 'What happens to the data files when you DROP a Managed Table?',
                    options: ['They persist in storage', 'They are deleted', 'They are archived', 'Nothing'],
                    correctAnswer: 'They are deleted',
                    points: 10
                },
                {
                    quizId: q2.insertedId,
                    text: 'In an External Table, who manages the metadata?',
                    options: ['The Cloud Provider', 'You', 'Databricks (Metastore)', 'No one'],
                    correctAnswer: 'Databricks (Metastore)',
                    points: 10
                }
            ]);
            console.log('Created DE Quiz 1');
        }
    }

    const mlCourse = await courses.findOne({ slug: 'ml-professional' });
    if (mlCourse) {
        await courses.updateOne({ _id: mlCourse._id }, { $set: { difficulty: 'INTERMEDIATE' } });
        console.log(`Updated ${mlCourse.title} to INTERMEDIATE`);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
