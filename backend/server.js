const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory task store
let tasks = [
  { id: 1, title: 'Complete project documentation', completed: false, createdAt: new Date() },
  { id: 2, title: 'Review pull requests', completed: true, createdAt: new Date() },
  { id: 3, title: 'Setup CI/CD pipeline', completed: false, createdAt: new Date() }
];

let nextId = 4;

// 1. GET /api/tasks - Retrieve all tasks
app.get('/api/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// 2. POST /api/tasks - Create a new task (Fixed validation)
app.post('/api/tasks', (req, res) => {
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

// 3. PUT /api/tasks/:id - Update task completion status (Fixed property check)
app.put('/api/tasks/:id', (req, res) => {
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

// 4. DELETE /api/tasks/:id - Delete a task (Fixed 404 status code)
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({ success: true, task: deletedTask });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Task Manager API running at http://localhost:${PORT}`);
});
