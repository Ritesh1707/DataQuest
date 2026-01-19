const { PrismaClient } = require('@prisma/client');
const { validateExercise } = require('../utils/validationEngine');

const prisma = new PrismaClient();

const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { 
        modules: {
          include: {
            lessons: true
          }
        } 
      },
    });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

const getLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { exercises: true },
    });
    
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    
    res.json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching lesson' });
  }
};

const submitExercise = async (req, res) => {
  try {
    const { userId } = req.user; // From Auth Middleware
    console.log('Submitting Exercise for UserID:', userId);
    console.log('Request Body:', req.body);
    const { exerciseId, code, userCode } = req.body;

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

    // Validate
    const submission = code || userCode || '';
    const validation = validateExercise(submission, exercise.solution);

    if (validation.success) {
      // Update Progress
      // Find valid lesson ID first
      const lesson = await prisma.lesson.findUnique({ where: { id: exercise.lessonId } });
      
      // Update Progress using manual check to avoid transaction/upsert on standalone mongo
      // lesson already defined above
      
      const existingProgress = await prisma.userProgress.findFirst({
        where: {
          userId: userId,
          lessonId: lesson.id
        }
      });

      if (existingProgress) {
        await prisma.userProgress.update({
          where: { id: existingProgress.id },
          data: { status: 'COMPLETED', completedAt: new Date() }
        });
      } else {
        await prisma.userProgress.create({
          data: {
            userId,
            lessonId: lesson.id,
            status: 'COMPLETED',
            completedAt: new Date()
          }
        });
      }
      
      // Award XP (Mock)
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: 10 } }
      });
      
      // Badge Check (Simple XP threshold)
      let newBadge = null;
      if (updatedUser.xp >= 10) {
         // Check if they already have "Spark Novice"
         const badge = await prisma.badge.findFirst({ where: { condition: 'xp_10' } });
         if (badge) {
             const hasBadge = await prisma.userBadge.findFirst({
                 where: { userId, badgeId: badge.id }
             });

             if (!hasBadge) {
                 await prisma.userBadge.create({
                     data: { userId, badgeId: badge.id }
                 });
                 newBadge = badge;
             }
         }
      }
    }

    res.json({ 
      success: validation.success, 
      message: validation.message,
      message: validation.message,
      xpEarned: validation.success ? 10 : 0,
      newBadge: newBadge
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting exercise' });
  }
};

module.exports = {
  getCourses,
  getLesson,
  submitExercise
};
