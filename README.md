# Task Manager - Bug Fix Assessment

A simple full-stack task manager application built with React and Express.js.

## Tech Stack
- **Frontend:** React (Vite), JavaScript, CSS
- **Backend:** Node.js, Express.js (In-memory storage)

## Project Structure
```text
bug-fix-challenge/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskStats.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md
├── BUG_REPORT.md
└── .gitignore
```

## How to Run

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Start Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

## API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task (`{ "title": "My Task" }`)
- `PUT /api/tasks/:id` - Update task status (`{ "completed": true }`)
- `DELETE /api/tasks/:id` - Delete a task by ID

## Bug Fixes
Detailed notes on all 10 bugs identified, root causes, and fixes applied are documented in [BUG_REPORT.md](./BUG_REPORT.md).
