# Bug Fix Report

This document details all 10 intentional bugs identified in the original Task Manager application, explaining the observed problem, root cause, the applied fix, files changed, and verification steps.

---

## Bug #1: Missing `await` in Initial Task Fetch

### Problem
On initial page load, tasks fail to display in the UI and the browser console throws an error (`tasks.map is not a function` or unhandled promise).

### Root Cause
In `frontend/src/services/api.js`, `const data = res.json();` was called without `await`. It returned a pending `Promise` object instead of the parsed array of tasks.

### Fix
Added `await` before `res.json()`:
```javascript
export async function fetchTasks() {
  const res = await fetch(`${API_URL}/api/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return await res.json();
}
```

### Files Changed
* `frontend/src/services/api.js`

### Testing
1. Started backend and frontend.
2. Loaded `http://localhost:3000`.
3. Verified initial tasks display properly in the list with no console errors.

---

## Bug #2: Incorrect API Endpoint for Task Deletion

### Problem
Clicking "Delete" on any task returned a 404 Not Found error from the server, and the task remained in the database.

### Root Cause
In `frontend/src/services/api.js`, `deleteTask` sent requests to `/api/task/${id}` (singular `task`), whereas the backend route is defined at `/api/tasks/:id` (plural `tasks`).

### Fix
Updated the endpoint URL to `/api/tasks/${id}`:
```javascript
export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return await res.json();
}
```

### Files Changed
* `frontend/src/services/api.js`

### Testing
1. Clicked "Delete" on a task.
2. Inspected Network tab in DevTools to confirm request is sent to `DELETE /api/tasks/:id` and returns 200 OK.

---

## Bug #3: Incorrect HTTP Method in Task Status Update

### Problem
Clicking the task completion checkbox triggered an error and failed to update the task status on the server.

### Root Cause
In `frontend/src/services/api.js`, `updateTaskStatus` sent an HTTP `POST` request instead of an HTTP `PUT` request expected by the backend.

### Fix
Changed request method to `PUT`:
```javascript
export async function updateTaskStatus(id, completed) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) throw new Error('Failed to update task');
  return await res.json();
}
```

### Files Changed
* `frontend/src/services/api.js`

### Testing
1. Checked a task checkbox.
2. Verified in Network tab that `PUT /api/tasks/:id` succeeded with status 200 OK.

---

## Bug #4: React State Overwritten When Adding a Task

### Problem
When adding a new task, all existing tasks disappeared from the UI and only the new task was shown.

### Root Cause
In `frontend/src/App.jsx`, `handleAddTask` called `setTasks([newTask])`, which replaced the entire array instead of appending to previous state.

### Fix
Used functional state update with spread syntax:
```javascript
const handleAddTask = async (title) => {
  try {
    setError(null);
    const newTask = await createTask(title);
    setTasks((prevTasks) => [...prevTasks, newTask]);
  } catch (err) {
    setError(err.message);
  }
};
```

### Files Changed
* `frontend/src/App.jsx`

### Testing
1. Entered a new task in the input field and clicked "Add Task".
2. Verified the new task was added to the list while keeping all existing tasks intact.

---

## Bug #5: Delete Handler Passing Array Index Instead of Task ID

### Problem
Deleting a task deleted the wrong task or failed with "Task not found", because the array index (`0`, `1`, etc.) was passed rather than the unique `task.id`.

### Root Cause
In `frontend/src/components/TaskItem.jsx`, the button had `onClick={() => onDelete(index)}`.

### Fix
Updated button to pass `task.id`:
```javascript
<button className="delete-btn" onClick={() => onDelete(task.id)}>
  Delete
</button>
```

### Files Changed
* `frontend/src/components/TaskItem.jsx`

### Testing
1. Tested with multiple tasks having arbitrary IDs.
2. Verified that deleting any specific task removes only that exact task.

---

## Bug #6: Inverted Filter Logic

### Problem
Selecting "Pending" showed completed tasks, and selecting "Completed" showed pending tasks.

### Root Cause
In `frontend/src/App.jsx`, the filter condition checked `if (filter === 'completed') return !task.completed;` and `if (filter === 'pending') return task.completed;`.

### Fix
Corrected the filter return values:
```javascript
const filteredTasks = tasks.filter((task) => {
  if (filter === 'completed') return task.completed;
  if (filter === 'pending') return !task.completed;
  return true;
});
```

### Files Changed
* `frontend/src/App.jsx`

### Testing
1. Clicked "Pending" -> Verified only incomplete tasks displayed.
2. Clicked "Completed" -> Verified only completed tasks displayed.
3. Clicked "All" -> Verified all tasks displayed.

---

## Bug #7: Swapped Task Statistics Calculation

### Problem
The statistics banner displayed pending count under "Completed" and completed count under "Pending".

### Root Cause
In `frontend/src/components/TaskStats.jsx`, `completedCount` was computed using `!task.completed` and `pendingCount` using `task.completed`.

### Fix
Swapped to proper boolean checks:
```javascript
const totalCount = tasks.length;
const completedCount = tasks.filter((task) => task.completed).length;
const pendingCount = tasks.filter((task) => !task.completed).length;
```

### Files Changed
* `frontend/src/components/TaskStats.jsx`

### Testing
1. Verified count values against the rendered task list.
2. Toggled a task completion status and verified real-time count updates.

---

## Bug #8: Backend Payload Property Mismatch

### Problem
When the frontend sent a toggle status update, the backend returned 200 OK but `task.completed` became `undefined` / `false`.

### Root Cause
In `backend/server.js`, the PUT handler checked `req.body.isCompleted` instead of `req.body.completed`.

### Fix
Updated the property check to `req.body.completed`:
```javascript
if (req.body.completed !== undefined) {
  task.completed = Boolean(req.body.completed);
}
```

### Files Changed
* `backend/server.js`

### Testing
1. Sent `PUT /api/tasks/1` with `{ "completed": true }`.
2. Verified task object in response returned `"completed": true`.

---

## Bug #9: Server Crash / 500 on Missing POST Body Title

### Problem
Submitting an empty JSON body `{}` or a request where `title` is missing caused an unhandled `TypeError: Cannot read properties of undefined (reading 'trim')`, crashing with a 500 error.

### Root Cause
In `backend/server.js`, `req.body.title.trim()` was executed directly without verifying that `req.body` and `req.body.title` are valid strings.

### Fix
Added safe type and existence validation:
```javascript
if (!req.body || !req.body.title || typeof req.body.title !== 'string' || !req.body.title.trim()) {
  return res.status(400).json({ message: 'Title is required' });
}
```

### Files Changed
* `backend/server.js`

### Testing
1. Sent POST request with `{}` and `{ "title": "   " }`.
2. Verified server returns clean `400 Bad Request` with `{ "message": "Title is required" }`.

---

## Bug #10: Incorrect HTTP Status Code on Delete Failure

### Problem
Deleting a non-existent task returned status `200 OK` with `{ success: false, message: 'Task not found' }`, which caused frontend `res.ok` to evaluate to `true` and bypass error handlers.

### Root Cause
In `backend/server.js`, the delete handler returned `res.status(200)` when `taskIndex === -1`.

### Fix
Changed status code to `404 Not Found`:
```javascript
if (taskIndex === -1) {
  return res.status(404).json({ success: false, message: 'Task not found' });
}
```

### Files Changed
* `backend/server.js`

### Testing
1. Sent `DELETE /api/tasks/99999`.
2. Verified the HTTP response status code is `404 Not Found`.
