// src/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isEmployeeLoggedIn, setIsEmployeeLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};