import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('truthlens_token') || null);
  const [loading, setLoading] = useState(true);

  // Set default authorization header for axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('truthlens_token', token);
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('truthlens_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`);
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('truthlens_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUserProfile = async (updatedData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, updatedData);
      if (response.data && response.data.user) {
        setUser(response.data.user);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
