# DataQuest: Master the Lakehouse Platform 🚀

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)
[![Status](https://img.shields.io/badge/Status-Beta-orange)]()

> A premium, gamified learning experience designed to turn data novices into Databricks Architects.
> featuring specialized "Career Tracks", interactive in-browser IDEs, and a competitive "Cosmic" achievement system.

---


## 🌟 Key Features

### 🎓 Interactive Learning Engine
- **In-Browser IDE**: Feature-rich Monaco editor supporting Python/PySpark syntax highlighting.
- **Real-Time Validation**: Instant feedback on code submissions (no more waiting for server execution queues).
- **"Nexus" Context**: Lessons are wrapped in immersive scenarios (e.g., "Build a Medallion Architecture for Mars Base Alpha").

### 🏆 Enterprise-Grade Gamification
- **Cosmic Rank System**: Progression from "Novice" to "Lakehouse Legend" based on XP.
- **Dynamic Leaderboards**: Global rankings updated in real-time to foster healthy competition.
- **Achievement System**: Unlock unique badges like *first_contact* (First Lesson) and *void_walker* (Course Completion).


---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 14](https://nextjs.org/) | App Router, Server Components, SSR |
| **Styling** | [TailwindCSS](https://tailwindcss.com/) | Utility-first CSS framework |
| **Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) | The code editor that powers VS Code |
| **Backend** | [Express.js](https://expressjs.com/) | Robust REST API server |
| **Database** | [MongoDB](https://www.mongodb.com/) | NoSQL database for flexible user & content schemas |
| **ORM** | [Prisma](https://www.prisma.io/) | Type-safe database client |
| **Auth** | [JWT](https://jwt.io/) | Secure stateless authentication |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Running locally on port 27017 or a cloud connection string)
- **Git**

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Ritesh1707/DataQuest.git
    cd dataquest
    ```

2.  **Setup the Server (Backend)**
    ```bash
    cd server
    
    # Install dependencies
    npm install
    
    # Configure Environment
    
    # Seed the Database (Important for initial content!)
    node src/utils/seed_runner.js
    node src/utils/seed_badges.js
    
    # Start the Development Server (Port 3001)
    npm run dev
    ```

3.  **Setup the Client (Frontend)**
    Open a new terminal window:
    ```bash
    cd client
    
    # Install dependencies
    npm install
    
    # Start Next.js Development Server (Port 3000)
    npm run dev
    ```

4.  **Access the App**
    Open your browser and navigate to `http://localhost:3000`.

---

## 📂 Project Structure

```bash
📦 dataquest
├── 📂 client                 # Next.js Frontend Application
│   ├── 📂 app                # App Router Pages (Dashboard, Learn, Auth)
│   ├── 📂 components         # Reusable UI Components (Navbar, GlassCard)
│   ├── 📂 lib                # Utilities (API Client, Constants)
│   └── 📄 global.css         # "Cosmic Dark" Theme Definitions
│
└── 📂 server                 # Express.js Backend API
    ├── 📂 src
    │   ├── 📂 controllers    # Request Logic (Auth, Content, Gamification)
    │   ├── 📂 models         # Prisma Schema
    │   ├── 📂 routes         # API Endpoints
    │   └── 📂 utils          # Validation Engine & Seed Scripts
    └── 📄 server.js          # Entry Point
```

---

## 🧪 Development & Testing

-   **Seeding Data**: The platform relies on content. Run `seed_runner.js` anytime to reset courses and `seed_badges.js` to update achievement definitions.
-   **Badges**: XP and Badge logic resides in `contentController.js`.
-   **Validation**: The `validationEngine.js` currently supports regex-based solution checking.

---

