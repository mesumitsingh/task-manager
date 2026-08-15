import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import TaskStats from './components/TaskStats';
import { fetchTasks, createTask, updateTaskStatus, deleteTask } from './services/api';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddTask = async (title) => {
    try {
      setError(null);
      const newTask = await createTask(title);
      setTasks([newTask]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleTask = async (id, completed) => {
    try {
      setError(null);
      const updatedTask = await updateTaskStatus(id, completed);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError(null);
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return !task.completed;
    if (filter === 'pending') return task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <div className="header">
        <h1>Task Manager</h1>
        <p>Full-Stack Bug Fix Challenge</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <TaskForm onAddTask={handleAddTask} />

      <TaskStats tasks={tasks} />

      <TaskFilter currentFilter={filter} onFilterChange={setFilter} />

      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
