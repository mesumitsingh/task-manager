const express = require('express');
const router = express.Router();

// In-memory data store for tasks
let tasks = [
  { id: 1, title: 'Complete project documentation', completed: false, createdAt: new Date() },
  { id: 2, title: 'Review pull requests', completed: true, createdAt: new Date() },
  { id: 3, title: 'Setup CI/CD pipeline', completed: false, createdAt: new Date() }
];

let nextId = 4;

// GET /api/tasks - Retrieve all tasks
router.get('/', (req, res) => {
  res.status(200).json(tasks);
});

// POST /api/tasks - Create a new task
router.post('/', (req, res) => {
  if (!req.body.title.trim()) {
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

// PUT /api/tasks/:id - Update task completion status
router.put('/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.body.isCompleted !== undefined) {
    task.completed = req.body.isCompleted;
  }

  res.status(200).json(task);
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(200).json({ success: false, message: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({ success: true, task: deletedTask });
});

module.exports = router;
