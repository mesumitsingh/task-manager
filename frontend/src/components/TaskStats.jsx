import React from 'react';

export default function TaskStats({ tasks }) {
  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => !task.completed).length;
  const pendingCount = tasks.filter((task) => task.completed).length;

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
