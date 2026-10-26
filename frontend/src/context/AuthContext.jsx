import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('careerai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('careerai_token') || null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const res = await authApi.getCurrentUser();
          setUser(res.data.user);
          localStorage.setItem('careerai_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error("Session restoration failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { access_token, user: loggedUser } = res.data;
    setToken(access_token);
    setUser(loggedUser);
    localStorage.setItem('careerai_token', access_token);
    localStorage.setItem('careerai_user', JSON.stringify(loggedUser));
    return loggedUser;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    const { access_token, user: newUser } = res.data;
    setToken(access_token);
    setUser(newUser);
    localStorage.setItem('careerai_token', access_token);
    localStorage.setItem('careerai_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch (e) {
      // Ignore logout api errors
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('careerai_token');
      localStorage.removeItem('careerai_user');
    }
  };

  const updateUserProfile = (updatedProfile) => {
    if (user) {
      const updatedUser = { ...user, profile: updatedProfile };
      setUser(updatedUser);
      localStorage.setItem('careerai_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
