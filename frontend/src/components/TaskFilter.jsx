import React from 'react';

export default function TaskFilter({ currentFilter, onFilterChange }) {
  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' }
  ];

  return (
    <div className="task-filters">
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`filter-btn ${currentFilter === filter.value ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
