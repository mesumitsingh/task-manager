# Bug Fix Report

This document records the 10 bugs identified in the application, their root causes, solutions, and testing verification.

---

## Bug #1: Missing `await` in Task Fetch

* **Problem:** Tasks do not load on page start, throwing a runtime error (`tasks.map is not a function`).
* **Root Cause:** In `frontend/src/services/api.js`, `fetchTasks` returned `res.json()` directly without `await`, returning an unresolved Promise instead of data.
* **Fix:** Added `await` to `res.json()`.
* **Files Changed:** `frontend/src/services/api.js`
* **Testing:** Reloaded the app; tasks rendered correctly on initial load.

---

## Bug #2: Incorrect API Endpoint for Deletion

* **Problem:** Clicking "Delete" causes a 404 Not Found error.
* **Root Cause:** In `frontend/src/services/api.js`, `deleteTask` called `/api/task/${id}` (singular) instead of `/api/tasks/${id}` (plural).
* **Fix:** Changed endpoint path to `/api/tasks/${id}`.
* **Files Changed:** `frontend/src/services/api.js`
* **Testing:** Clicked "Delete"; verified `DELETE /api/tasks/:id` returned 200 OK.

---

## Bug #3: Incorrect HTTP Method for Task Status Update

* **Problem:** Toggling task completion checkbox fails to update the backend.
* **Root Cause:** In `frontend/src/services/api.js`, `updateTaskStatus` used HTTP method `POST` instead of `PUT`.
* **Fix:** Changed fetch request method to `PUT`.
* **Files Changed:** `frontend/src/services/api.js`
* **Testing:** Toggled checkbox; verified `PUT /api/tasks/:id` succeeded with status 200.

---

## Bug #4: State Overwritten on Task Creation

* **Problem:** Adding a new task removes all existing tasks and shows only the newly created task.
* **Root Cause:** In `frontend/src/App.jsx`, `handleAddTask` called `setTasks([newTask])`, replacing the existing array.
* **Fix:** Updated to append new task: `setTasks((prev) => [...prev, newTask])`.
* **Files Changed:** `frontend/src/App.jsx`
* **Testing:** Added multiple tasks consecutively; all tasks remained visible in the list.

---

## Bug #5: Wrong Identifier Passed to Delete Handler

* **Problem:** Deleting a task deletes an incorrect item or fails with "Task not found".
* **Root Cause:** In `frontend/src/components/TaskItem.jsx`, the button passed array `index` instead of `task.id` to `onDelete`.
* **Fix:** Updated `onClick` to pass `task.id`.
* **Files Changed:** `frontend/src/components/TaskItem.jsx`
* **Testing:** Deleted specific tasks by ID; verified the correct item was removed.

---

## Bug #6: Inverted Filter Logic

* **Problem:** Clicking "Pending" shows completed tasks, and clicking "Completed" shows pending tasks.
* **Root Cause:** In `frontend/src/App.jsx`, the boolean checks inside `.filter()` were inverted.
* **Fix:** Corrected return values to `filter === 'completed' ? task.completed : !task.completed`.
* **Files Changed:** `frontend/src/App.jsx`
* **Testing:** Clicked "Pending" and "Completed" filters; verified each tab displays only the matching tasks.

---

## Bug #7: Inverted Statistics Counts

* **Problem:** The Pending and Completed counts in the stats header were swapped.
* **Root Cause:** In `frontend/src/components/TaskStats.jsx`, `completedCount` checked `!task.completed` and `pendingCount` checked `task.completed`.
* **Fix:** Corrected filter predicates for both count variables.
* **Files Changed:** `frontend/src/components/TaskStats.jsx`
* **Testing:** Checked total, pending, and completed counts against the actual task list.

---

## Bug #8: Backend Payload Key Mismatch on Update

* **Problem:** Updating completion status succeeded with 200 OK, but task stayed uncompleted (`completed: undefined`).
* **Root Cause:** In `backend/server.js`, the PUT route checked `req.body.isCompleted` while frontend sent `{ completed }`.
* **Fix:** Updated condition to `req.body.completed !== undefined` and assigned `Boolean(req.body.completed)`.
* **Files Changed:** `backend/server.js`
* **Testing:** Sent PUT request; verified `completed` boolean property was correctly persisted.

---

## Bug #9: Backend Crash on Missing Title

* **Problem:** Sending POST with empty body `{}` threw `TypeError: Cannot read properties of undefined (reading 'trim')` with 500 error.
* **Root Cause:** In `backend/server.js`, `req.body.title.trim()` was accessed without verifying if `req.body.title` was provided as a string.
* **Fix:** Added validation `if (!req.body || !req.body.title || typeof req.body.title !== 'string' || !req.body.title.trim())`.
* **Files Changed:** `backend/server.js`
* **Testing:** Sent empty POST payload; received clean `400 Bad Request` with `{ message: "Title is required" }`.

---

## Bug #10: Incorrect HTTP Status Code on Delete Error

* **Problem:** Deleting a non-existent task returned status `200 OK` with an error message, misleading client-side handlers.
* **Root Cause:** In `backend/server.js`, the delete handler returned `res.status(200)` when `taskIndex === -1`.
* **Fix:** Changed response status to `res.status(404)`.
* **Files Changed:** `backend/server.js`
* **Testing:** Sent DELETE request for invalid ID; confirmed `404 Not Found` response.
