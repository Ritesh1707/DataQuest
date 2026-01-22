# Project Replication Context: DataQuest

## 1. Project Overview
DataQuest is a gamified learning platform for Data & AI professionals (Databricks focused).
It uses a Next.js frontend with a "Cosmic Dark" aesthetic and an Express.js backend with MongoDB/Prisma.

## 2. Directory Structure
```
/
├── client/                 # Next.js 14 (App Router)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── globals.css
└── server/                 # Express.js API
    ├── prisma/
    └── src/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        └── utils/
```

## 3. Database Schema (Prisma)
`server/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(STUDENT)
  xp        Int      @default(0)
  level     Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  progress  UserProgress[]
  badges    UserBadge[]
}

enum Role {
  STUDENT
  ADMIN
}

model Course {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  slug        String   @unique
  modules     Module[]
  createdAt   DateTime @default(now())
}

model Module {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  order       Int
  courseId    String   @db.ObjectId
  course      Course   @relation(fields: [courseId], references: [id])
  lessons     Lesson[]
}

model Lesson {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  content     String
  order       Int
  moduleId    String   @db.ObjectId
  module      Module   @relation(fields: [moduleId], references: [id])
  exercises   Exercise[]
  progress    UserProgress[]
}

model Exercise {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  prompt      String
  starterCode String?
  solution    String?
  order       Int
  lessonId    String   @db.ObjectId
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
}

model UserProgress {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  lessonId  String   @db.ObjectId
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  status    ProgressStatus @default(NOT_STARTED)
  completedAt DateTime?
  @@unique([userId, lessonId])
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

model Badge {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String
  condition   String
  imageUrl    String?
  users       UserBadge[]
}

model UserBadge {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  badgeId   String   @db.ObjectId
  badge     Badge    @relation(fields: [badgeId], references: [id])
  awardedAt DateTime @default(now())
}
```

## 4. Backend Implementation

### `server/src/server.js` (Entry Point)
```javascript
require('dotenv').config();
const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

### `server/src/app.js`
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const gamificationRoutes = require('./routes/gamification');

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/gamification', gamificationRoutes);

module.exports = app;
```

### `server/src/middleware/authMiddleware.js`
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'supersecret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
```

## 5. Frontend Implementation

### `client/lib/api.js` (API Wrapper)
```javascript
const API_URL = 'http://localhost:3001/api';

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }
  return data;
}

export const api = {
  login: (email, password) => fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (email, password, name) => fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  }),
  getCourses: () => fetchWithAuth('/content/courses'),
  getLesson: (id) => fetchWithAuth(`/content/lessons/${id}`),
  submitExercise: (exerciseId, code) => fetchWithAuth('/content/exercises/submit', {
    method: 'POST',
    body: JSON.stringify({ exerciseId, code }),
  }),
  getLeaderboard: () => fetchWithAuth('/gamification/leaderboard'),
  getUserRank: () => fetchWithAuth('/gamification/my-rank'),
  getAchievements: () => fetchWithAuth('/gamification/achievements'),
  getMe: () => fetchWithAuth('/auth/me'),
};
```

### `client/app/globals.css` (Style System)
```css
@import "tailwindcss";

:root {
  --brick-red: #FF3621;
  --deep-space: #0B1016;
  --void: #020408;
  --glass: rgba(255, 255, 255, 0.05);
}

@theme inline {
  --color-background: var(--deep-space);
  --color-brick: var(--brick-red);
}

body {
  background: var(--color-void);
  color: white;
}

/* Glassmorphism Utilities */
.glass-panel {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

## 6. Key Business Logic (Gamification)

### Badge Logic (`server/src/controllers/contentController.js` snippet)
When submitting an exercise, we check:
1. `first_lesson`: If `completedCount >= 1`.
2. `5_exercises`: If `completedCount >= 5`.
We verify against the `Badge` collection and insert into `UserBadge` if not already present.

### Leaderboard Logic (`server/src/controllers/gamificationController.js`)
We fetch users sorted by `xp: 'desc'`, take the top 10. `getUserRank` calculates the specific user's index in the sorted list.

## 7. Configuration & Environment

### `server/package.json` Scripts
```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

### `client/package.json` Scripts
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

### `.env` (Server)
```
DATABASE_URL="mongodb://localhost:27017/hackathon"
JWT_SECRET="your-secret-key"
PORT=3001
```
