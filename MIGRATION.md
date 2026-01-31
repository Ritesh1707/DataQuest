# 🚀 Project Migration Guide

This guide explains how to transfer the **DataQuest** project to a new machine while preserving your database data (Users, Progress, Quizzes).

## 📦 What is included?
- **Source Code**: Full project (Server + Client).
- **Database Data**: A snapshot of your MongoDB data is in `server/data_dump/`.
- **Automation**: `setup.bat` (Windows) and `setup.sh` (Mac/Linux) to handle installation.

---

## 🛠️ Steps on the New Machine

### 1. Prerequisite
Ensure **Node.js** is installed.
- Download: [nodejs.org](https://nodejs.org/)
- Verify: Open terminal and run `node -v`

### 2. Copy Project
Copy this entire project folder to your new machine.

### 3. Run Setup
#### Windows
Double-click **`setup.bat`** in the project root.

#### Mac / Linux
Open a terminal in the project root and run:
```bash
chmod +x setup.sh
./setup.sh
```

### 4. Configuration (Important!)
The setup script creates a `.env` file in the `server/` folder from a template. 
**You must edit this file to add your API Keys.**

1. Open `server/.env`.
2. Add your **Google Gemini API Key**:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```
3. (Optional) formatting checks: Verify `DATABASE_URL` matches your new machine's MongoDB (default is `mongodb://localhost:27017`).

### 5. Start the App
Open two terminals:

**Terminal 1 (Server):**
```bash
cd server
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```

## ⚠️ Troubleshooting
- **Missing Data?**: Check if `server/data_dump` exists. You can manually run `npm run db:import` in the `server` folder to re-import data.
- **Connection Error?**: Ensure your MongoDB is running and the `DATABASE_URL` in `server/.env` is correct.
