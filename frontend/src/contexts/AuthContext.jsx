import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      setLoading(true);
      // 1. Check for user token in localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
        setLoading(false);
        return;
      }
      // 2. Only check for admin session if on an /admin route
      if (window.location.pathname.startsWith('/admin')) {
        try {
          const res = await api.get('/admin/profile');
          if (isMounted) {
            setUser({ ...res.data, role: 'admin' });
            console.log('AuthContext: admin session found after refresh', res.data);
          }
        } catch (err) {
          if (isMounted) setUser(null);
          // Only log 401 if not initial load and not expected
          if (err.response && err.response.status === 401 && user) {
            console.log('AuthContext: session 401 after refresh (unexpected, user was set)');
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        if (isMounted) setLoading(false);
      }
    };
    checkAuth();
    return () => { isMounted = false; };
  }, []);

  // User login (JWT)
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      setUser(null);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Admin login (session)
  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/admin/login', { email, password });
      setUser({ ...res.data.admin, role: 'admin' });
      return { success: true };
    } catch (err) {
      setUser(null);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const userData = user;
    setUser(null);
    try {
      await api.post('/admin/logout');
    } catch (err) {
      // Ignore errors, just ensure session is cleared
    }
    // Clear user token and info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show logout toast
    const userName = userData?.name || userData?.email || 'User';
    toast.info(`Goodbye, ${userName}! You have been successfully logged out.`);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, loginAdmin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 