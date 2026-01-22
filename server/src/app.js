const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Gamified Learning Platform API is running' });
});

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const gamificationRoutes = require('./routes/gamification');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/quizzes', require('./routes/quiz'));

module.exports = app;
