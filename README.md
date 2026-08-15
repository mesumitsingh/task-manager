# Task Manager (Bug Fix Challenge)

A lightweight, full-stack Task Manager application built with **React** and **Node.js/Express**.

---

## Features

- View all tasks
- Create a new task
- Mark tasks as completed / pending
- Delete a task
- Filter tasks by status (`All`, `Pending`, `Completed`)
- Real-time task statistics (Total, Pending, Completed counts)

---

## Tech Stack

- **Frontend:** React 18, Vite, Vanilla CSS, Native Fetch API
- **Backend:** Node.js, Express.js, CORS (In-memory storage)

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

## Quick Start

### 1. Run Backend
```bash
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:5000`.

### 2. Run Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
Application opens on `http://localhost:3000`.

---

## API Documentation

| Method | Endpoint | Description | Request Payload | Response Status |
|---|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks | — | `200 OK` |
| `POST` | `/api/tasks` | Add a new task | `{ "title": "Task title" }` | `201 Created` |
| `PUT` | `/api/tasks/:id` | Update completion | `{ "completed": true }` | `200 OK` |
| `DELETE` | `/api/tasks/:id` | Remove a task | — | `200 OK` |

---

## Bug Fix Report

All 10 identified bugs, root causes, code fixes, and testing steps are documented in [`BUG_REPORT.md`](./BUG_REPORT.md).
