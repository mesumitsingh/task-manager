import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
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

  // Fixed: Append new task instead of overwriting list
  const handleAddTask = async (title) => {
    try {
      setError(null);
      const newTask = await createTask(title);
      setTasks((prevTasks) => [...prevTasks, newTask]);
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

  // Fixed: Proper filter logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <div className="header">
        <h1>Task Manager</h1>
        <p>Simple Full-Stack Task Management Application</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <TaskForm onAddTask={handleAddTask} />

      <TaskStats tasks={tasks} />

      <div className="task-filters">
        {['all', 'pending', 'completed'].map((type) => (
          <button
            key={type}
            className={`filter-btn ${filter === type ? 'active' : ''}`}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty-state">No tasks found.</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
