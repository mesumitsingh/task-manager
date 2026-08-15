# Bug Fix Challenge: Task Manager Application

Welcome to the Task Manager Bug Fix Challenge! This project simulates a practical full-stack debugging assessment for software engineering internship candidates.

---

## Project Overview

The application is a simple, lightweight Task Manager designed with a React frontend and a Node.js/Express backend. Users should be able to create tasks, view tasks, toggle task completion, delete tasks, filter tasks by status, and view real-time task statistics.

---

## Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** JavaScript (ES6+)
- **Styling:** CSS3
- **Networking:** Native Fetch API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Middleware:** CORS, Express JSON parser
- **Storage:** In-Memory Array Data Store

---

## Project Structure

```text
bug-fix-challenge/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskFilter.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── TaskStats.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   │   └── tasks.js
│   ├── package.json
│   └── server.js
│
├── README.md
└── BUG_REPORT.md
```

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (bundled with Node.js)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## Running the Application

### 1. Start the Backend Server
From the `backend/` directory:
```bash
npm run dev
# or
npm start
```
The backend server runs on `http://localhost:5000`.

### 2. Start the Frontend Application
From the `frontend/` directory in a new terminal:
```bash
npm run dev
```
The Vite development server runs on `http://localhost:3000`.

---

## Expected API Endpoints

| Method | Endpoint | Description | Request Body | Success Status |
|--------|----------|-------------|--------------|----------------|
| `GET` | `/api/tasks` | Retrieve all tasks | None | `200 OK` |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "Task title" }` | `201 Created` |
| `PUT` | `/api/tasks/:id` | Update task completion status | `{ "completed": true }` | `200 OK` |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID | None | `200 OK` |

---

## Expected Application Functionality

1. **Task Display:** On initial load, the task list should fetch and render all existing tasks from the backend.
2. **Task Creation:** Typing a title into the input and submitting adds a new pending task and appends it to the list without losing existing tasks.
3. **Task Completion:** Clicking the checkbox toggles the task's completed state (strikethrough title and updated checkbox status).
4. **Task Deletion:** Clicking the "Delete" button removes the exact corresponding task from both backend and frontend.
5. **Task Filtering:**
   - **All:** Displays all tasks.
   - **Pending:** Displays only uncompleted tasks.
   - **Completed:** Displays only completed tasks.
6. **Task Statistics:** Accurately displays the count for **Total**, **Pending**, and **Completed** tasks in real time.
7. **Validation & Error Handling:** Gracefully handles invalid inputs and network errors without crashing either the frontend or backend.

---

## Candidate Instructions

1. Run both the backend and frontend servers.
2. Test every user flow and feature in the browser and API client.
3. Inspect network requests, console logs, and backend logs to identify issues.
4. Locate and fix the bugs across the frontend and backend codebases.
5. Document your findings, root causes, and solutions in `BUG_REPORT.md`.
