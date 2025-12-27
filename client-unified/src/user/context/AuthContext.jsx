// src/user/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, verifyEmailOtp, logoutUser, getProfile } from '../api/api';

// ✅ 1. EXPORT the context so it can be imported by name elsewhere
export const AuthContext = createContext();

// ✅ 2. KEEP this custom hook to easily access the context's value
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userPhone = localStorage.getItem('userPhone');
    
    if (token && userPhone) {
      setIsAuthenticated(true);
      loadUserProfile(userPhone);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async (phone) => {
    try {
      const userData = await getProfile(phone);
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Clear invalid session
      localStorage.removeItem('authToken');
      localStorage.removeItem('userPhone');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      const response = await loginUser(phone, password);
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        if (response.user?.phone) localStorage.setItem('userPhone', response.user.phone);
        setIsAuthenticated(true);
        setUser(response.user);
        await loadUserProfile(response.user?.phone || phone);
        return { success: true };
      }
      return { success: false, error: 'Login failed: no token received' };
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error: err || 'Login failed' };
    }
  };

  const register = async (data) => {
    try {
      const response = await registerUser(data);
      return { success: response.success, error: response.message };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const verifyEmail = async (data) => {
    try {
      const response = await verifyEmailOtp(data);
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        if (response.user?.phone) localStorage.setItem('userPhone', response.user.phone);
        setIsAuthenticated(true);
        setUser(response.user);
        await loadUserProfile(response.user?.phone || data?.phone);
        return { success: true };
      }
      return { success: false, error: 'Email verification failed: no token received' };
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      return { success: false, error: err };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPhone');
    setIsAuthenticated(false);
    setUser(null);
    return { success: true };
  };

  const updateUserData = (newUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...newUserData }));
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    verifyEmail,
    logout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};