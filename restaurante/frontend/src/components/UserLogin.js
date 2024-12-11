// src/UserLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';

function UserLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  }); // Estado para manejar los datos del formulario
  const [error, setError] = useState(null); // Estado para manejar los errores
  const navigate = useNavigate(); // Hook para la navegación

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario de inicio de sesión
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/users/login/', formData)
      .then(response => {
        localStorage.setItem('access_token', response.data.access);
        alert('User logged in successfully!');
        navigate('/manage-users'); // Redirigir a ManageUsers
      })
      .catch(error => {
        console.error('There was an error logging in the user!', error);
        setError('Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
      });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>User Login</Typography>
      {error && <Alert severity="error">{error}</Alert>} {/* Mostrar mensaje de error si existe */}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
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

export default UserLogin;