import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Loaded stored user:', parsedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    console.log('Login called with userData:', userData); 
    console.log('Token received:', token);
    console.log('Role received:', userData.role);
    
    if (!token || typeof token !== 'string' || token.trim() === '') {
      console.error('Invalid token received:', token);
      return;
    }
    
    // Save user and token to local storage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setCurrentUser(userData);
    
    // Check if user is admin based on the role
    const isAdminUser = userData.role === 'ROLE_ADMIN';
    console.log('Is admin user:', isAdminUser);
    
    if (isAdminUser) {
      console.log('Redirecting to admin dashboard');
      navigate('/admin-dashboard');
    } else {
      console.log('Redirecting to regular dashboard');
      navigate('/dashboard');
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  // Check if user is admin based on the role
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';
  console.log('Current user role:', currentUser?.role);
  console.log('Is admin:', isAdmin);

  const value = {
    currentUser,
    isAdmin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return auth;
};