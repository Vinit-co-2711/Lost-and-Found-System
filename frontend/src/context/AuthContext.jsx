import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user_details');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Handle user login.
   * Calls public Auth API and persists session details.
   */
  const login = async (username, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || 'Authentication failed');
    }

    const data = await response.json();
    
    // Save to local storage
    localStorage.setItem('access_token', data.accessToken);
    const userDetails = {
      id: data.id,
      username: data.username,
      role: data.role,
    };
    localStorage.setItem('user_details', JSON.stringify(userDetails));

    setToken(data.accessToken);
    setUser(userDetails);
    return userDetails;
  };

  /**
   * Register a new user profile.
   */
  const register = async (username, email, password, role = 'CUSTOMER') => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, role }),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || 'Registration failed');
    }

    return response.text();
  };

  /**
   * Clear active user sessions.
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_details');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isStaffOrAdmin: user ? (user.role === 'STAFF' || user.role === 'ADMIN') : false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be nested inside an AuthProvider');
  }
  return context;
}
