// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Aquí podrías verificar el token con el servidor para asegurarte de que es válido
      setIsEmployeeLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isEmployeeLoggedIn, setIsEmployeeLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};