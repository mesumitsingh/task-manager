# Fixed Bugs Report — Task Manager Application

This document provides a comprehensive report of all **10 intentional bugs** found in the original project, showing the **Broken Code (Before)**, the **Fixed Code (After)**, the **Root Cause**, and the **Verification Test**.

---

## Summary Table

| Bug # | Component / Layer | File | Issue Type | Resolution |
|:---:|:---|:---|:---|:---:|
| **1** | Frontend / API | `frontend/src/services/api.js` | Missing `await` in `fetchTasks` | Added `await res.json()` |
| **2** | Frontend / API | `frontend/src/services/api.js` | Typo in delete endpoint | Changed `/api/task/` to `/api/tasks/` |
| **3** | Frontend / API | `frontend/src/services/api.js` | Incorrect HTTP method for update | Changed `POST` to `PUT` |
| **4** | Frontend / State | `frontend/src/App.jsx` | State overwrite on task creation | Appended with `[...prev, newTask]` |
| **5** | Frontend / UI | `frontend/src/components/TaskItem.jsx` | Passed array index instead of ID | Passed `task.id` to `onDelete` |
| **6** | Frontend / Logic | `frontend/src/App.jsx` | Inverted filter logic | Corrected filter predicates |
| **7** | Frontend / UI | `frontend/src/components/TaskStats.jsx` | Swapped pending/completed counts | Fixed boolean condition count |
| **8** | Backend / API | `backend/server.js` | Request body key mismatch | Used `req.body.completed` |
| **9** | Backend / Validation | `backend/server.js` | 500 error on missing `title` | Added safe type & presence check |
| **10** | Backend / API | `backend/server.js` | 200 OK returned on 404 delete error | Changed status to `404 Not Found` |

---

## Detailed Bug Reports & Code Diffs

### Bug #1: Missing `await` in Initial Task Fetch

* **File:** [`frontend/src/services/api.js`](file:///e:/ZeroNorth/Task%202/bug-fix-challenge/frontend/src/services/api.js)
* **Problem:** Tasks failed to render on initial page load, causing `tasks.map is not a function`.
* **Root Cause:** `res.json()` returns a Promise. Without `await`, the function resolved with a Promise object instead of the parsed JSON array.

#### Code Diff:
```javascript
// BEFORE (Broken):
export async function fetchTasks() {
  const res = await fetch(`${API_URL}/api/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data = res.json(); // Missing await!
  return data;
}

// AFTER (Fixed):
export async function fetchTasks() {
  const res = await fetch(`${API_URL}/api/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data = await res.json();
  return data;
}
```
* **Testing:** Reloaded the web application; verified the 3 initial tasks rendered cleanly on the UI.

---

### Bug #2: Incorrect API Endpoint for Task Deletion

* **File:** [`frontend/src/services/api.js`](file:///e:/ZeroNorth/Task%202/bug-fix-challenge/frontend/src/services/api.js)
* **Problem:** Clicking "Delete" sent an HTTP request that resulted in `404 Not Found`.
* **Root Cause:** The endpoint URL was written as singular `/api/task/${id}` instead of plural `/api/tasks/${id}`.

#### Code Diff:
```javascript
// BEFORE (Broken):
export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/api/task/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return await res.json();
}

// AFTER (Fixed):
export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete task');
  return await res.json();
}
```
* **Testing:** Clicked "Delete"; verified DevTools Network tab dispatched `DELETE http://localhost:5000/api/tasks/:id` with status `200 OK`.

---

### Bug #3: Incorrect HTTP Method for Task Status Update

* **File:** [`frontend/src/services/api.js`](file:///e:/ZeroNorth/Task%202/bug-fix-challenge/frontend/src/services/api.js)
* **Problem:** Toggling the completion checkbox failed to update the backend database.
* **Root Cause:** The fetch request was configured with `method: 'POST'` instead of `method: 'PUT'`.

#### Code Diff:
```javascript
// BEFORE (Broken):
export async function updateTaskStatus(id, completed) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'POST', // Incorrect method
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) throw new Error('Failed to update task');
  return await res.json();
}

// AFTER (Fixed):
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
* **Testing:** Checked the completion checkbox; verified `PUT /api/tasks/:id` updated the task and persisted state on reload.

---

### Bug #4: React State Overwritten When Adding a Task

* **File:** [`frontend/src/App.jsx`](file:///e:/ZeroNorth/Task%202/bug-fix-challenge/frontend/src/App.jsx)
* **Problem:** Adding a new task removed all previous tasks from the screen.
* **Root Cause:** State was updated with `setTasks([newTask])`, which replaced the entire array instead of appending.

#### Code Diff:
```javascript
// BEFORE (Broken):
const handleAddTask = async (title) => {
  try {
    setError(null);
    const newTask = await createTask(title);
    setTasks([newTask]); // Overwriting previous tasks
  } catch (err) {
    setError(err.message);
  }
};

// AFTER (Fixed):
const handleAddTask = async (title) => {
  try {
    setError(null);
    const newTask = await createTask(title);
    setTasks((prevTasks) => [...prevTasks, newTask]); // Appending to state
  } catch (err) {
    setError(err.message);
  }
};
```
* **Testing:** Added 3 consecutive tasks; verified all previous and new tasks remained in the list.

---

### Bug #5: Wrong Identifier Passed to Delete Handler

* **File:** [`frontend/src/components/TaskItem.jsx`](file:///e:/ZeroNorth/Task%202/bug-fix-challenge/frontend/src/components/TaskItem.jsx)
* **Problem:** Deleting a task sent an array index (e.g. `0`, `1`) instead of the task's database `id`.
* **Root Cause:** In the JSX button, the handler passed `index` rather than `task.id`.

#### Code Diff:
```javascript
// BEFORE (Broken):
<button className="delete-btn" onClick={() => onDelete(index)}>
  Delete
</button>

// AFTER (Fixed):
<button className="delete-btn" onClick={() => onDelete(task.id)}>
  Delete
</button>
```
* **Testing:** Created tasks with IDs `10`, `11`; clicked delete on ID `11`; verified only ID `11` was deleted.

---

### Bug #6: Inverted Filter Logic

* **File:** [`frontend/src/App.jsx`](file:///e:/ZeroNorth/Task%202/bug-fix-challenge/frontend/src/App.jsx)
* **Problem:** "Pending" tab showed completed tasks, and "Completed" tab showed pending tasks.
* **Root Cause:** The filter condition returned `!task.completed` for `'completed'` and `task.completed` for `'pending'`.

#### Code Diff:
```javascript
// BEFORE (Broken):
const filteredTasks = tasks.filter((task) => {
  if (filter === 'completed') return !task.completed;
  if (filter === 'pending') return task.completed;
  return true;
});

// AFTER (Fixed):
const filteredTasks = tasks.filter((task) => {
  if (filter === 'completed') return task.completed;
  if (filter === 'pending') return !task.completed;
  return true;
});
```
* **Testing:** Switched between "All", "Pending", and "Completed"; verified correct tasks displayed in each view.

---

### Bug #7: Swapped Task Statistics Calculation

* **File:** [`frontend/src/components/TaskStats.jsx`](file:///e:/ZeroNorth/Task%202/bug-fix-challenge/frontend/src/components/TaskStats.jsx)
* **Problem:** Completed count was shown under Pending, and Pending count was shown under Completed.
* **Root Cause:** `completedCount` used `!task.completed` and `pendingCount` used `task.completed`.

#### Code Diff:
```javascript
// BEFORE (Broken):
const totalCount = tasks.length;
const completedCount = tasks.filter((task) => !task.completed).length;
const pendingCount = tasks.filter((task) => task.completed).length;

// AFTER (Fixed):
const totalCount = tasks.length;
const completedCount = tasks.filter((task) => task.completed).length;
const pendingCount = tasks.filter((task) => !task.completed).length;
```
* **Testing:** Toggled a task; verified Pending count decreased by 1 and Completed count increased by 1.

---

### Bug #8: Backend Payload Key Mismatch on PUT Update

* **File:** [`backend/server.js`](file:///e:/ZeroNorth/Task%202/bug-fix-challenge/backend/server.js)
* **Problem:** Updating completion status sent `{ completed: true }`, but the backend set `task.completed = undefined`.
* **Root Cause:** Backend checked `req.body.isCompleted` instead of `req.body.completed`.

#### Code Diff:
```javascript
// BEFORE (Broken):
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (req.body.isCompleted !== undefined) {
    task.completed = req.body.isCompleted; // undefined
  }
  res.status(200).json(task);
});

// AFTER (Fixed):
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (req.body.completed !== undefined) {
    task.completed = Boolean(req.body.completed);
  }
  res.status(200).json(task);
});
```
* **Testing:** Dispatched `PUT /api/tasks/1` with `{ "completed": true }`; verified response returns `"completed": true`.

---

### Bug #9: Server Crash on Missing/Invalid Request Body

* **File:** [`backend/server.js`](file:///e:/ZeroNorth/Task%202/bug-fix-challenge/backend/server.js)
* **Problem:** Sending an empty POST `{}` crashed the server with `500 Internal Server Error`.
* **Root Cause:** `req.body.title.trim()` was executed directly without checking if `req.body` or `title` was defined.

#### Code Diff:
```javascript
// BEFORE (Broken):
app.post('/api/tasks', (req, res) => {
  if (!req.body.title.trim()) { // Crashes if req.body.title is undefined
    return res.status(400).json({ message: 'Title is required' });
  }
  // ...
});

// AFTER (Fixed):
app.post('/api/tasks', (req, res) => {
  if (!req.body || !req.body.title || typeof req.body.title !== 'string' || !req.body.title.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }
  // ...
});
```
* **Testing:** Sent POST with `{}` and `{ "title": "   " }`; verified clean `400 Bad Request` with `{ message: "Title is required" }`.

---

### Bug #10: Incorrect HTTP Status Code on Delete Failure

* **File:** [`backend/server.js`](file:///e:/ZeroNorth/Task%202/bug-fix-challenge/backend/server.js)
* **Problem:** Deleting a non-existent ID returned `200 OK` with `{ success: false, message: 'Task not found' }`, masking the failure from client-side `res.ok`.
* **Root Cause:** The route handler sent `res.status(200)` when `taskIndex === -1`.

#### Code Diff:
```javascript
// BEFORE (Broken):
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(200).json({ success: false, message: 'Task not found' }); // Wrong status code!
  }
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({ success: true, task: deletedTask });
});

// AFTER (Fixed):
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({ success: true, task: deletedTask });
});
```
* **Testing:** Sent `DELETE /api/tasks/99999`; verified response status code is `404 Not Found`.
