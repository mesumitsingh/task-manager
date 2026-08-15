import React from 'react';

export default function TaskItem({ task, index, onToggle, onDelete }) {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
        />
        <span className="task-title">{task.title}</span>
      </div>
      <button className="delete-btn" onClick={() => onDelete(index)}>
        Delete
      </button>
    </li>
  );
}
