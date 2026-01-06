import axios from 'axios';

// Create an axios instance without default headers for auth requests
export const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create another instance for authenticated requests
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authenticated requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request URL:', config.url);
    console.log('Token from localStorage:', token);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header set:', `Bearer ${token}`);
    } else {
      // Log warning but don't redirect here - let the response interceptor handle it
      console.warn('No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      data: error.response?.data
    });

    if (error.response) {
      // Handle 401 (Unauthorized) or 403 (Forbidden)
      if (error.response.status === 401 || error.response.status === 403) {
        console.log('Unauthorized or Forbidden response. Clearing auth data...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Return the error response data if it exists
      if (error.response.data) {
        return Promise.reject(error.response.data);
      }
    }
    
    // For network errors or other issues
    return Promise.reject(error);
  }
);

// Set authorization header from localStorage on initial load
const token = localStorage.getItem('token');
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log('Initial authorization header set:', `Bearer ${token}`);
}

export default axiosInstance;