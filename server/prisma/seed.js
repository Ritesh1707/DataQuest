const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding (Simple Mode 2)...');
  
  try {
    // Avoid deleteMany as it requires Replica Set for transactions in Prisma sometimes
    
    // Create Course
    const course = await prisma.course.create({
      data: {
        title: 'Databricks Fundamentals',
        description: 'Master the basics of Databricks and Apache Spark.',
        slug: 'databricks-101-' + Date.now(), // Unique
      },
    });
    console.log('Created Course:', course.id);

    // Create Module
    const module1 = await prisma.module.create({
      data: {
        title: 'Introduction to Spark',
        order: 1,
        courseId: course.id,
      },
    });
    console.log('Created Module:', module1.id);

    // Create Lesson
    const lesson1 = await prisma.lesson.create({
      data: {
        title: 'SparkContext & RDDs',
        content: '# SparkContext\n\nThe entry point to Spark functionality.',
        order: 1,
        moduleId: module1.id,
      },
    });
    console.log('Created Lesson:', lesson1.id);
    
    // Create Exercise
    await prisma.exercise.create({
      data: {
        prompt: 'Create a Resilient Distributed Dataset (RDD) from a list of numbers [1, 2, 3].',
        starterCode: '// Type code here',
        solution: 'sc.parallelize', 
        order: 1,
        lessonId: lesson1.id,
      },
    });

  } catch (e) {
    console.error('Seed Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
