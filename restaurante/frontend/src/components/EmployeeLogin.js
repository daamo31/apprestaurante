// src/EmployeeLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';

function EmployeeLogin() {
  const [username, setUsername] = useState(''); // Estado para manejar el nombre de usuario
  const [password, setPassword] = useState(''); // Estado para manejar la contraseña
  const { loginEmployee } = useAuth(); // Usa useAuth para acceder a la función de inicio de sesión de empleados
  const navigate = useNavigate(); // Hook para la navegación
  const [error, setError] = useState(''); // Estado para manejar los errores de inicio de sesión

  // Función para manejar el envío del formulario de inicio de sesión
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await loginEmployee(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Error en el inicio de sesión. Por favor, verifica tus credenciales.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Employee Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
}

export default EmployeeLogin;