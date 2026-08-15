# Bug Fix Report

This report outlines the 10 bugs identified during the assessment, explaining why each bug occurred, how it was fixed, and the testing done.

---

### Bug 1: Missing `await` on `res.json()` in task fetching
- **Problem:** Tasks were not displaying on initial load, throwing `tasks.map is not a function` in the browser console.
- **Root Cause:** `fetchTasks()` in `frontend/src/services/api.js` returned `res.json()` directly without `await`, returning an unresolved Promise instead of the array.
- **Fix:** Added `await` before `res.json()`.
- **File:** `frontend/src/services/api.js`
- **Testing:** Reloaded the frontend; initial tasks rendered correctly.

---

### Bug 2: Typo in Delete API endpoint URL
- **Problem:** Clicking delete threw a 404 Not Found error.
- **Root Cause:** In `deleteTask()`, the URL was set to `/api/task/${id}` (singular `task`) instead of `/api/tasks/${id}` (plural `tasks`).
- **Fix:** Changed the URL path to `/api/tasks/${id}`.
- **File:** `frontend/src/services/api.js`
- **Testing:** Deleted a task and verified `DELETE /api/tasks/:id` responded with 200 OK.

---

### Bug 3: Wrong HTTP method in status toggle
- **Problem:** Clicking a task's checkbox failed to update its completion state on the server.
- **Root Cause:** `updateTaskStatus()` sent a `POST` request, but the backend route is listening on `PUT /api/tasks/:id`.
- **Fix:** Changed fetch request method to `PUT`.
- **File:** `frontend/src/services/api.js`
- **Testing:** Toggled checkboxes and verified in DevTools network tab that `PUT` requests succeed.

---

### Bug 4: State overwritten when creating a task
- **Problem:** Adding a task caused all existing tasks to disappear from the list.
- **Root Cause:** `handleAddTask` in `App.jsx` was doing `setTasks([newTask])`, which replaced the state array with only the new item.
- **Fix:** Changed to `setTasks((prev) => [...prev, newTask])` to append the new task.
- **File:** `frontend/src/App.jsx`
- **Testing:** Added multiple tasks consecutively; all items remained in the list.

---

### Bug 5: Passing array index instead of task ID to delete handler
- **Problem:** Deleting an item removed the wrong task or failed because the array index was passed instead of the task's ID.
- **Root Cause:** In `TaskItem.jsx`, the delete button called `onClick={() => onDelete(index)}`.
- **Fix:** Updated the button to call `onDelete(task.id)`.
- **File:** `frontend/src/components/TaskItem.jsx`
- **Testing:** Created tasks with different IDs and deleted individual items; verified only the targeted task was removed.

---

### Bug 6: Inverted filter conditions
- **Problem:** Clicking "Pending" showed completed tasks, and clicking "Completed" showed pending tasks.
- **Root Cause:** In `App.jsx`, the filter condition checked `filter === 'completed'` and returned `!task.completed` (inverted).
- **Fix:** Fixed the logic so `filter === 'completed'` returns `task.completed` and `'pending'` returns `!task.completed`.
- **File:** `frontend/src/App.jsx`
- **Testing:** Switched between All, Pending, and Completed filters to confirm correct tasks show up under each tab.

---

### Bug 7: Swapped counts in TaskStats
- **Problem:** The Pending count showed completed tasks and the Completed count showed pending tasks.
- **Root Cause:** In `TaskStats.jsx`, `completedCount` was computed using `!task.completed` and `pendingCount` used `task.completed`.
- **Fix:** Corrected both filter conditions in `TaskStats.jsx`.
- **File:** `frontend/src/components/TaskStats.jsx`
- **Testing:** Checked total, pending, and completed counters after adding and completing tasks.

---

### Bug 8: Property name mismatch in backend PUT route
- **Problem:** Marking a task as completed did not save properly; `task.completed` became `undefined`.
- **Root Cause:** In `server.js`, the PUT handler checked `req.body.isCompleted`, but the frontend sends `{ completed: true }`.
- **Fix:** Updated `server.js` to check and assign `req.body.completed`.
- **File:** `backend/server.js`
- **Testing:** Sent a PUT request with `{ completed: true }` and verified the response contains `completed: true`.

---

### Bug 9: Backend 500 crash on missing title in POST request
- **Problem:** Sending an empty or invalid POST request crashed the server with `TypeError: Cannot read properties of undefined (reading 'trim')`.
- **Root Cause:** `server.js` ran `req.body.title.trim()` directly without checking if `req.body.title` exists or is a string.
- **Fix:** Added validation `if (!req.body || !req.body.title || typeof req.body.title !== 'string' || !req.body.title.trim())` returning 400 Bad Request.
- **File:** `backend/server.js`
- **Testing:** Sent empty `{}` and `{ "title": "   " }` payloads to `/api/tasks`; server returned clean 400 errors instead of crashing.

---

### Bug 10: Backend returning 200 OK for not found task on delete
- **Problem:** Deleting a non-existent task ID returned HTTP 200 with an error JSON, preventing client `res.ok` checks from catching the error.
- **Root Cause:** `server.js` sent `res.status(200).json({ success: false, message: 'Task not found' })`.
- **Fix:** Changed status code to `404 Not Found`.
- **File:** `backend/server.js`
- **Testing:** Sent `DELETE /api/tasks/999` and verified the server returns a 404 status.
