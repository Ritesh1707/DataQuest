# Gamified Databricks Learning Platform

## Getting Started

### Prerequisites
- Node.js
- MongoDB (Running locally on port 27017)

### Installation

1. **Backend**
   ```bash
   cd server
   npm install
   # If not seeded yet
   node src/utils/seed_runner.js
   
   # Start Server
   npm run start
   # or
   node src/server.js
   ```

2. **Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Features
- **Dashboard**: View courses and modules.
- **Interactive IDE**: Monaco editor with mock validation for Databricks code.
- **Gamification**: XP, Leaderboards, Confetti on success.
- **Authentication**: JWT based.

### Tech Stack
- Express.js (Backend)
- Next.js (Frontend)
- MongoDB & Prisma (Database)
- TailwindCSS & Lucide (UI)
