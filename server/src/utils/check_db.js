const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB!");
    
    // Check counts
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    
    console.log(`Database: hackathon`);
    console.log(`Users: ${userCount}`);
    console.log(`Courses: ${courseCount}`);
    
    // In MongoDB, collections are created on first write. 
    // If counts are 0, collections might not exist yet visible to a GUI unless explicitly created, 
    // but Prisma manages this.
    
  } catch (e) {
    console.error("Connection failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
