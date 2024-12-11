// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false); // Estado para manejar si el empleado ha iniciado sesión
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Estado para manejar si el usuario ha iniciado sesión
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga

  // Efecto para verificar la autenticación al montar el componente
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
              setIsEmployeeLoggedIn(true); // Establecer el estado de inicio de sesión del empleado
            } else {
              setIsUserLoggedIn(true); // Establecer el estado de inicio de sesión del usuario
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
      setLoading(false); // Establecer el estado de carga a falso
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión como empleado
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
        setIsEmployeeLoggedIn(true); // Establecer el estado de inicio de sesión del empleado
      } else {
        throw new Error(data.detail || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  // Función para iniciar sesión como usuario
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
        setIsUserLoggedIn(true); // Establecer el estado de inicio de sesión del usuario
      } else {
        throw new Error(data.detail || 'Error en el inicio de sesión');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('access_token');
    setIsEmployeeLoggedIn(false); // Restablecer el estado de inicio de sesión del empleado
    setIsUserLoggedIn(false); // Restablecer el estado de inicio de sesión del usuario
  };

  return (
    <AuthContext.Provider value={{ isEmployeeLoggedIn, isUserLoggedIn, loginEmployee, loginUser, logout, loading }}>
      {!loading && children} {/* Renderizar los hijos solo cuando no esté cargando */}
    </AuthContext.Provider>
  );
};