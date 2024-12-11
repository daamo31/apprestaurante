// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await fetch('http://localhost:8000/api/token/verify/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.is_employee) {
              setIsEmployeeLoggedIn(true);
            } else {
              setIsUserLoggedIn(true);
            }
          } else {
            localStorage.removeItem('access_token');
            setIsEmployeeLoggedIn(false);
            setIsUserLoggedIn(false);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('access_token');
          setIsEmployeeLoggedIn(false);
          setIsUserLoggedIn(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginEmployee = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
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

  const loginUser = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        setIsUserLoggedIn(true);
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
    setIsUserLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isEmployeeLoggedIn, isUserLoggedIn, loginEmployee, loginUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};