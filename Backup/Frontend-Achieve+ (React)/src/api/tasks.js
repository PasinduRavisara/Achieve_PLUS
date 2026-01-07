import axiosInstance from './axiosConfig';

// Utility function to handle errors consistently
const handleError = (error) => {
  console.error('API Error:', error);
  if (error.response && error.response.data) {
    return Promise.reject(error.response.data);
  }
  return Promise.reject({ message: error.message || 'An error occurred' });
};

// User tasks endpoints
export const getCurrentUserTasks = async () => {
  try {
    // Add debug logs to check authorization
    console.log('Fetching my tasks, headers:', axiosInstance.defaults.headers);
    const response = await axiosInstance.get('/tasks/my-tasks');
    console.log('My tasks response:', response.data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getTaskById = async (taskId) => {
  try {
    const response = await axiosInstance.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axiosInstance.put(`/tasks/${taskId}/status`, { status });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Admin task endpoints
export const getAllTasks = async () => {
  try {
    console.log('Fetching all tasks...');
    const response = await axiosInstance.get('/tasks/admin/all');
    console.log('All tasks response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    return handleError(error);
  }
};

export const getTasksByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/tasks/admin/user/${userId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createTask = async (taskData) => {
  try {
    // Ensure the task data includes a status field
    const taskWithStatus = {
      ...taskData,
      status: taskData.status || 'PENDING'  
    };
    const response = await axiosInstance.post('/tasks/admin', taskWithStatus);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    // Ensure the task data includes a status field when updating
    const taskWithStatus = {
      ...taskData,
      status: taskData.status || 'Updated'  
    };
    const response = await axiosInstance.put(`/tasks/admin/${taskId}`, taskWithStatus);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    await axiosInstance.delete(`/tasks/admin/${taskId}`);
    return true;
  } catch (error) {
    return handleError(error);
  }
};

// Get task statistics for the current user
export const getCurrentUserStats = async () => {
  try {
    const response = await axiosInstance.get('/tasks/my-stats');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getMyTasks = async () => {
  try {
    console.log('getMyTasks - Token:', localStorage.getItem('token'));
    const response = await axiosInstance.get('/tasks/my-tasks');
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};