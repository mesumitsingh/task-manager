const API_URL = 'http://localhost:5000';

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/api/tasks`);
  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data = res.json();
  return data;
}

export async function createTask(title) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });
  if (!res.ok) {
    throw new Error('Failed to create task');
  }
  return await res.json();
}

export async function updateTaskStatus(id, completed) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) {
    throw new Error('Failed to update task');
  }
  return await res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/api/task/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error('Failed to delete task');
  }
  return await res.json();
}
