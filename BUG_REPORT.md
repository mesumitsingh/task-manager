# Bug Fix Report

This document details all 10 intentional bugs identified in the Task Manager application, their root causes, recommended fixes, affected files, and verification steps.

---

## Bug #1: Missing `await` on `res.json()` in Initial Task Fetch

### Problem
When the application loads, tasks fail to display in the UI and the browser console throws a runtime error (e.g., `tasks.map is not a function` or tasks list is empty/broken).

### Root Cause
In `frontend/src/services/api.js`, the `fetchTasks` function calls `const data = res.json();` without the `await` keyword. As a result, `data` is returned as an unresolved `Promise` instead of the parsed array of task objects.

### Fix
Add `await` to `res.json()`:
```javascript
export async function fetchTasks() {
  const res = await fetch(`${API_URL}/api/tasks`);
  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data = await res.json();
  return data;
}
```

### Files Changed
- `frontend/src/services/api.js`

### Testing
1. Start both backend and frontend servers.
2. Refresh `http://localhost:3000`.
3. Verify that initial mock tasks load and render in the task list without console errors.

---

## Bug #2: Incorrect API Endpoint in Task Deletion

### Problem
Clicking the "Delete" button on a task triggers an HTTP 404 error in the browser network tab, and the task is not deleted from the backend.

### Root Cause
In `frontend/src/services/api.js`, the `deleteTask` function requests `${API_URL}/api/task/${id}` (singular `task`), whereas the backend Express router is registered at `/api/tasks` (plural `tasks`).

### Fix
Correct the endpoint URL to plural:
```javascript
export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error('Failed to delete task');
  }
  return await res.json();
}
```

### Files Changed
- `frontend/src/services/api.js`

### Testing
1. Click the "Delete" button next to a task.
2. Inspect the Network tab in DevTools to confirm the request goes to `DELETE http://localhost:5000/api/tasks/:id`.

---

## Bug #3: Incorrect HTTP Method in Task Completion Update

### Problem
Toggling a task's completion checkbox fails with an HTTP 404 or 405 error because the backend cannot match the endpoint method.

### Root Cause
In `frontend/src/services/api.js`, `updateTaskStatus` sends an HTTP `POST` request to `${API_URL}/api/tasks/${id}` instead of an HTTP `PUT` request as expected by the backend router.

### Fix
Change `method: 'POST'` to `method: 'PUT'`:
```javascript
export async function updateTaskStatus(id, completed) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) {
    throw new Error('Failed to update task');
  }
  return await res.json();
}
```

### Files Changed
- `frontend/src/services/api.js`

### Testing
1. Click the checkbox on any task.
2. Verify in the Network tab that a `PUT /api/tasks/:id` request is dispatched with status 200 OK.

---

## Bug #4: React State Overwritten When Adding New Task

### Problem
When creating a new task, all existing tasks disappear from the screen and only the newly created task is displayed.

### Root Cause
In `frontend/src/App.jsx`, `handleAddTask` executes `setTasks([newTask])`, which replaces the entire state array with a single-element array containing only the new task, rather than appending it.

### Fix
Append the new task to the existing task array using the functional state updater:
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
- `frontend/src/App.jsx`

### Testing
1. Add a new task using the input form.
2. Verify that existing tasks remain in the list and the new task is appended to the bottom.

---

## Bug #5: Delete Handler Passing Array Index Instead of Task ID

### Problem
Deleting a task deletes the wrong task or fails with `Task not found` because the array index is sent to the backend instead of the task's database `id`.

### Root Cause
In `frontend/src/components/TaskItem.jsx`, the delete button triggers `onClick={() => onDelete(index)}` instead of `onClick={() => onDelete(task.id)}`.

### Fix
Pass `task.id` to `onDelete`:
```javascript
<button className="delete-btn" onClick={() => onDelete(task.id)}>
  Delete
</button>
```

### Files Changed
- `frontend/src/components/TaskItem.jsx`

### Testing
1. Have tasks with non-zero IDs (e.g. ID `2`, `3`).
2. Delete the second item and verify that task with ID `2` is removed from both backend and UI.

---

## Bug #6: Inverted Filter Logic (Completed vs. Pending)

### Problem
Clicking the "Pending" filter button displays completed tasks, and clicking "Completed" displays pending tasks.

### Root Cause
In `frontend/src/App.jsx`, the filtering condition inverted the boolean check:
`if (filter === 'completed') return !task.completed;`
`if (filter === 'pending') return task.completed;`

### Fix
Correct the filter predicates:
```javascript
const filteredTasks = tasks.filter((task) => {
  if (filter === 'completed') return task.completed;
  if (filter === 'pending') return !task.completed;
  return true;
});
```

### Files Changed
- `frontend/src/App.jsx`

### Testing
1. Create both completed and pending tasks.
2. Click "Pending" -> Verify only uncompleted tasks are shown.
3. Click "Completed" -> Verify only completed tasks are shown.
4. Click "All" -> Verify all tasks are shown.

---

## Bug #7: Task Statistics Calculation Swapped

### Problem
The statistics card shows the number of completed tasks under "Pending" and the number of pending tasks under "Completed".

### Root Cause
In `frontend/src/components/TaskStats.jsx`, `completedCount` is computed with `!task.completed` and `pendingCount` is computed with `task.completed`.

### Fix
Correct the filter condition for both counts:
```javascript
export default function TaskStats({ tasks }) {
  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="task-stats">
      <div className="stat-item">
        <span className="stat-label">Total</span>
        <span className="stat-value">{totalCount}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Pending</span>
        <span className="stat-value">{pendingCount}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Completed</span>
        <span className="stat-value">{completedCount}</span>
      </div>
    </div>
  );
}
```

### Files Changed
- `frontend/src/components/TaskStats.jsx`

### Testing
1. Observe the stats counts on screen.
2. Toggle a task from pending to completed.
3. Verify that the Pending count decrements by 1 and the Completed count increments by 1.

---

## Bug #8: Backend Payload Property Name Mismatch on Update

### Problem
When the frontend sends an update to mark a task as completed, the backend responds with 200 OK but the task remains uncompleted (`completed: undefined` / `false`).

### Root Cause
In `backend/routes/tasks.js`, the PUT handler expects `req.body.isCompleted`:
`if (req.body.isCompleted !== undefined) task.completed = req.body.isCompleted;`
However, the client sends `{ completed: true }`.

### Fix
Update the property name check to `completed`:
```javascript
router.put('/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.body.completed !== undefined) {
    task.completed = Boolean(req.body.completed);
  }

  res.status(200).json(task);
});
```

### Files Changed
- `backend/routes/tasks.js`

### Testing
1. Send a `PUT` request with `{ "completed": true }` to `/api/tasks/1`.
2. Inspect the JSON response to verify `"completed": true`.

---

## Bug #9: Server Crash / 500 on Malformed POST Request Body

### Problem
Sending a POST request with an empty body `{}` or a non-string `title` causes an unhandled `TypeError: Cannot read properties of undefined (reading 'trim')`, returning a 500 Internal Server Error instead of a 400 Bad Request.

### Root Cause
In `backend/routes/tasks.js`, the route directly executes `if (!req.body.title.trim())` without first validating that `req.body.title` is defined and is a valid string.

### Fix
Add safe type and existence checking before trimming:
```javascript
router.post('/', (req, res) => {
  if (!req.body || !req.body.title || typeof req.body.title !== 'string' || !req.body.title.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newTask = {
    id: nextId++,
    title: req.body.title.trim(),
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});
```

### Files Changed
- `backend/routes/tasks.js`

### Testing
1. Send a POST request to `/api/tasks` with body `{}` or `{ "title": "   " }`.
2. Verify the server returns status `400 Bad Request` with `{ "message": "Title is required" }` instead of crashing.

---

## Bug #10: Incorrect HTTP Status Code (200 OK Instead of 404) on Delete Failure

### Problem
When attempting to delete a task with a non-existent ID, the backend returns HTTP status 200 OK with `{ success: false, message: 'Task not found' }`. Because `200` is considered a successful HTTP status, client-side error handling (`res.ok`) does not trigger.

### Root Cause
In `backend/routes/tasks.js`, the delete handler uses `res.status(200)` when `taskIndex === -1`.

### Fix
Return HTTP status `404 Not Found`:
```javascript
router.delete('/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({ success: true, task: deletedTask });
});
```

### Files Changed
- `backend/routes/tasks.js`

### Testing
1. Send a DELETE request to `/api/tasks/99999`.
2. Verify the response status code is `404 Not Found`.
