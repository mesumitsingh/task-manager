# Fixed Bugs Report

This report documents all 10 bugs identified in the application, including the root cause, before/after code changes, and testing verification.

---

## Summary of Bugs

| # | Bug Title | File | Root Cause | Fix |
|---|---|---|---|---|
| 1 | Missing `await` in Task Fetch | `frontend/src/services/api.js` | `res.json()` returned Promise without await | Added `await res.json()` |
| 2 | Typo in Delete Endpoint | `frontend/src/services/api.js` | Endpoint was `/api/task/` (singular) | Changed to `/api/tasks/` (plural) |
| 3 | Wrong HTTP Method for Update | `frontend/src/services/api.js` | Sent `POST` instead of `PUT` | Changed method to `PUT` |
| 4 | State Overwritten on Task Add | `frontend/src/App.jsx` | `setTasks([newTask])` replaced state | Appended with `[...prev, newTask]` |
| 5 | Array Index Passed to Delete | `frontend/src/components/TaskItem.jsx` | Passed `index` instead of `task.id` | Passed `task.id` |
| 6 | Inverted Filter Logic | `frontend/src/App.jsx` | Filter conditions were inverted | Fixed boolean checks |
| 7 | Inverted Statistics Count | `frontend/src/components/TaskStats.jsx` | Pending/Completed counts swapped | Swapped filter conditions |
| 8 | Backend Property Key Mismatch | `backend/server.js` | Checked `isCompleted` instead of `completed` | Checked `req.body.completed` |
| 9 | Backend Crash on Missing Title | `backend/server.js` | Called `.trim()` without presence check | Added safe validation |
| 10 | Wrong Status Code on Delete Error | `backend/server.js` | Returned 200 on missing task | Changed to 404 Not Found |

---

## Detailed Bug Fixes

### Bug #1: Missing `await` on `res.json()`
* **File:** `frontend/src/services/api.js`
* **Problem:** Tasks failed to load on page startup (`tasks.map is not a function`).
* **Root Cause:** `res.json()` was called without `await`, returning an unresolved Promise.
* **Fix:**
```javascript
// Before
const data = res.json();
return data;

// After
const data = await res.json();
return data;
```
* **Testing:** Reloaded frontend; initial tasks rendered correctly.

---

### Bug #2: Typo in Delete API Endpoint URL
* **File:** `frontend/src/services/api.js`
* **Problem:** Deleting a task returned a 404 error.
* **Root Cause:** URL was set to singular `/api/task/${id}` instead of plural `/api/tasks/${id}`.
* **Fix:**
```javascript
// Before
const res = await fetch(`${API_URL}/api/task/${id}`, { method: 'DELETE' });

// After
const res = await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
```
* **Testing:** Clicked Delete; verified `DELETE /api/tasks/:id` responded with 200 OK.

---

### Bug #3: Incorrect HTTP Method in Task Status Update
* **File:** `frontend/src/services/api.js`
* **Problem:** Toggling task completion checkbox failed on the backend.
* **Root Cause:** `updateTaskStatus` sent `POST` instead of `PUT`.
* **Fix:**
```javascript
// Before
const res = await fetch(`${API_URL}/api/tasks/${id}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ completed })
});

// After
const res = await fetch(`${API_URL}/api/tasks/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ completed })
});
```
* **Testing:** Toggled checkbox; verified `PUT /api/tasks/:id` succeeded.

---

### Bug #4: React State Overwritten When Adding a Task
* **File:** `frontend/src/App.jsx`
* **Problem:** Adding a new task removed all previous tasks from the list.
* **Root Cause:** `setTasks([newTask])` replaced the array instead of appending.
* **Fix:**
```javascript
// Before
setTasks([newTask]);

// After
setTasks((prevTasks) => [...prevTasks, newTask]);
```
* **Testing:** Added multiple tasks; confirmed all tasks remain visible.

---

### Bug #5: Wrong Identifier Passed to Delete Handler
* **File:** `frontend/src/components/TaskItem.jsx`
* **Problem:** Deleting a task removed the wrong task because the array index was passed.
* **Root Cause:** The button called `onClick={() => onDelete(index)}`.
* **Fix:**
```javascript
// Before
<button className="delete-btn" onClick={() => onDelete(index)}>Delete</button>

// After
<button className="delete-btn" onClick={() => onDelete(task.id)}>Delete</button>
```
* **Testing:** Deleted specific tasks by ID; verified the correct item was removed.

---

### Bug #6: Inverted Filter Logic
* **File:** `frontend/src/App.jsx`
* **Problem:** "Pending" showed completed tasks, and "Completed" showed pending tasks.
* **Root Cause:** Condition returned `!task.completed` for `'completed'` and `task.completed` for `'pending'`.
* **Fix:**
```javascript
// Before
if (filter === 'completed') return !task.completed;
if (filter === 'pending') return task.completed;

// After
if (filter === 'completed') return task.completed;
if (filter === 'pending') return !task.completed;
```
* **Testing:** Tested all filter tabs to ensure correct tasks display.

---

### Bug #7: Swapped Statistics Calculation
* **File:** `frontend/src/components/TaskStats.jsx`
* **Problem:** Pending and Completed counters in the header were inverted.
* **Root Cause:** `completedCount` checked `!task.completed` and `pendingCount` checked `task.completed`.
* **Fix:**
```javascript
// Before
const completedCount = tasks.filter((task) => !task.completed).length;
const pendingCount = tasks.filter((task) => task.completed).length;

// After
const completedCount = tasks.filter((task) => task.completed).length;
const pendingCount = tasks.filter((task) => !task.completed).length;
```
* **Testing:** Verified counter numbers update accurately in real time.

---

### Bug #8: Backend Payload Property Mismatch
* **File:** `backend/server.js`
* **Problem:** Updating completion status did not persist; `completed` became `undefined`.
* **Root Cause:** Backend checked `req.body.isCompleted` instead of `req.body.completed`.
* **Fix:**
```javascript
// Before
if (req.body.isCompleted !== undefined) {
  task.completed = req.body.isCompleted;
}

// After
if (req.body.completed !== undefined) {
  task.completed = Boolean(req.body.completed);
}
```
* **Testing:** Sent PUT request with `{ completed: true }`; confirmed value persisted.

---

### Bug #9: Backend 500 Crash on Missing Title
* **File:** `backend/server.js`
* **Problem:** Sending POST with empty body `{}` crashed with `TypeError: Cannot read properties of undefined (reading 'trim')`.
* **Root Cause:** Called `req.body.title.trim()` directly without validation.
* **Fix:**
```javascript
// Before
if (!req.body.title.trim()) {
  return res.status(400).json({ message: 'Title is required' });
}

// After
if (!req.body || !req.body.title || typeof req.body.title !== 'string' || !req.body.title.trim()) {
  return res.status(400).json({ message: 'Title is required' });
}
```
* **Testing:** Sent empty POST payload; confirmed clean 400 response.

---

### Bug #10: Incorrect HTTP Status Code on Delete Error
* **File:** `backend/server.js`
* **Problem:** Deleting a non-existent task returned 200 OK, masking the error from client `res.ok`.
* **Root Cause:** `server.js` sent `res.status(200)` when `taskIndex === -1`.
* **Fix:**
```javascript
// Before
if (taskIndex === -1) {
  return res.status(200).json({ success: false, message: 'Task not found' });
}

// After
if (taskIndex === -1) {
  return res.status(404).json({ success: false, message: 'Task not found' });
}
```
* **Testing:** Sent DELETE request for non-existent ID; verified 404 Not Found response.
