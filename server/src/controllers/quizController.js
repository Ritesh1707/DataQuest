const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            points: true
            // Exclude correctAnswer and explanation
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching quiz' });
  }
};

const submitQuiz = async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body; // { questionId: "Option A" }
  const userId = req.user.id;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true }
    });

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    let maxScore = 0;
    const results = [];

    quiz.questions.forEach(q => {
      const userAns = answers[q.id];
      const isCorrect = userAns === q.correctAnswer;
      maxScore += q.points;
      if (isCorrect) score += q.points;

      results.push({
        questionId: q.id,
        isCorrect,
        correctAnswer: q.correctAnswer, // Reveal answer now
        explanation: q.explanation
      });
    });

    // Record Result
    await prisma.userQuizResult.create({
      data: {
        userId,
        quizId: id,
        score,
        maxScore
      }
    });

    // Award XP (if passed > 70%)
    const percentage = (score / maxScore) * 100;
    let xpAwarded = 0;
    if (percentage >= 70) {
      xpAwarded = 50; // Flat reward for now
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpAwarded } }
      });
    }

    res.json({
      score,
      maxScore,
      percentage,
      xpAwarded,
      results
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
};

module.exports = { getQuiz, submitQuiz };
