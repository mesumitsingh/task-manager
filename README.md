# Task Manager — Full-Stack Bug Fix Challenge

A simple, minimal Task Manager application built with React (Vite) and Node.js (Express). Designed as a practical 24-hour internship debugging assessment for a final-year B.Tech CSE student.

---

## Project Overview

The application provides simple task management functionality:
* View all tasks
* Create a new task
* Toggle task completion status
* Delete a task
* Filter tasks (All / Pending / Completed)
* View task statistics (Total, Pending, Completed)

---

## Technology Stack

* **Frontend:** React 18, Vite, JavaScript (ES6+), Vanilla CSS, Native Fetch API
* **Backend:** Node.js, Express.js, CORS, In-Memory Array Data Store

---

## Project Structure

```text
bug-fix-challenge/
├── backend/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
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
├── README.md
├── BUG_REPORT.md
└── .gitignore
```

---

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Setup (in a separate terminal)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## API Endpoints

| Method | Endpoint | Description | Request Body | Status Code |
|---|---|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks | None | `200 OK` |
| `POST` | `/api/tasks` | Create a task | `{ "title": "string" }` | `201 Created` |
| `PUT` | `/api/tasks/:id` | Update completion | `{ "completed": boolean }` | `200 OK` |
| `DELETE` | `/api/tasks/:id` | Delete task | None | `200 OK` |

---

## Debugging Challenge Documentation

Refer to [`BUG_REPORT.md`](./BUG_REPORT.md) for detailed descriptions, root cause analysis, code fixes, and testing verification for all 10 bugs.
