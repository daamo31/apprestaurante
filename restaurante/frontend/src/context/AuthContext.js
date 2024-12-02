// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8000/api/verify-token/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            setIsEmployeeLoggedIn(true);
          } else {
            localStorage.removeItem('access_token');
            setIsEmployeeLoggedIn(false);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('access_token');
          setIsEmployeeLoggedIn(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/employees/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        setIsEmployeeLoggedIn(true);
      } else {
        throw new Error(data.detail || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsEmployeeLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isEmployeeLoggedIn, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};