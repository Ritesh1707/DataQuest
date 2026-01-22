const { PrismaClient } = require('@prisma/client');
const { validateExercise } = require('../utils/validationEngine');

const prisma = new PrismaClient();

const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { 
        modules: {
          include: {
            lessons: true,
            quizzes: {
              select: { id: true, title: true, difficulty: true }
            }
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

const { getDb } = require('../utils/db');
const { ObjectId } = require('mongodb');

const submitExercise = async (req, res) => {
  try {
    const { userId } = req.user; // From Auth Middleware
    console.log('Submitting Exercise for UserID:', userId);
    const { exerciseId, code, userCode } = req.body;

    const db = await getDb();
    const exercisesV = db.collection('Exercise');
    const lessonsV = db.collection('Lesson');
    const progressV = db.collection('UserProgress');
    const usersV = db.collection('User');
    const badgesV = db.collection('Badge');
    const userBadgesV = db.collection('UserBadge');

    // Fetch Exercise
    const exercise = await exercisesV.findOne({ _id: new ObjectId(exerciseId) });

    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

    // Validate
    const submission = code || userCode || '';
    const validation = validateExercise(submission, exercise.solution);

    if (validation.success) {
      // Find Lesson
      const lesson = await lessonsV.findOne({ _id: new ObjectId(exercise.lessonId) });
      
      // Update Progress (Upsert)
      const uId = new ObjectId(userId);
      const lId = lesson._id;

      await progressV.updateOne(
        { userId: uId, lessonId: lId },
        { 
          $set: { status: 'COMPLETED', completedAt: new Date() }
        },
        { upsert: true }
      );
      
      // Award XP
      await usersV.updateOne(
        { _id: uId },
        { $inc: { xp: 10 } }
      );
      
      // Badge Check
      const completedCount = await progressV.countDocuments({ userId: uId, status: 'COMPLETED' });
      let newBadge = null;

      // Badges to check
      const checks = [
        { condition: 'first_lesson', threshold: 1 },
        { condition: '5_exercises', threshold: 5 } // Using lessons as proxy for exercises
      ];

      for (const check of checks) {
        if (completedCount >= check.threshold) {
             const badge = await badgesV.findOne({ condition: check.condition });
             if (badge) {
                 const hasBadge = await userBadgesV.findOne({
                     userId: uId, badgeId: badge._id
                 });
    
                 if (!hasBadge) {
                     await userBadgesV.insertOne({
                         userId: uId, badgeId: badge._id, awardedAt: new Date()
                     });
                     newBadge = badge; // Return the most recent one (or array if multiple)
                 }
             }
        }
      }

      return res.json({ 
        success: validation.success, 
        message: validation.message,
        xpEarned: 10,
        newBadge: newBadge
      });
    }

    res.json({ 
      success: validation.success, 
      message: validation.message,
      xpEarned: 0,
      newBadge: null
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
