import axiosInstance, { authAxios } from './axiosConfig';

const extractJwtToken = (response) => {
  // If token is directly in the response
  if (response.token) {
    return response.token;
  }
  // If token is in a nested object
  if (response.data && response.data.token) {
    return response.data.token;
  }
  return null;
};

const isJwtToken = (str) => {
  const jwtPattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  return jwtPattern.test(str);
};

export const login = async (credentials) => {
  try {
    console.log('Attempting login with:', credentials);
    
    const authRequest = {
      email: credentials.email,
      password: credentials.password
    };

    const response = await authAxios.post('/auth/login', authRequest);
    console.log('Raw login response:', response.data);

    const jwtToken = extractJwtToken(response.data);
    console.log('Extracted JWT token:', jwtToken);
    
    if (!jwtToken) {
      throw new Error('No valid JWT token found in server response');
    }

    // Store the JWT token in localStorage
    localStorage.setItem('token', jwtToken);
    
    // Extract user data from response
    const userData = {
      id: response.data.id, // Make sure this matches the backend response field
      email: response.data.email,
      fullName: response.data.fullName,
      role: response.data.role || 'ROLE_USER',
    };

    console.log('Processed user data to store:', userData);
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Set the Authorization header for immediate use
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    
    return {
      ...userData,
      token: jwtToken
    };
  } catch (error) {
    console.error('Login error:', error.response || error);
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 403) {
        throw { message: 'Access denied. Please check your credentials.' };
      } else if (status === 401) {
        throw { message: 'Invalid email or password.' };
      } else if (data && data.message) {
        throw { message: data.message };
      }
    }
    
    throw { message: 'Login failed. Please try again.' };
  }
};

export const register = async (userData) => {
  try {
    const response = await authAxios.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw { message: 'Registration failed. Please try again.' };
    }
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (e) {
    console.error('Error parsing stored user:', e);
    return null;
  }
};

export const getCurrentToken = () => {
  return localStorage.getItem('token');
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'ROLE_ADMIN';
};