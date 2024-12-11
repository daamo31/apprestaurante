import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';

function UserRegister() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  }); // Estado para manejar los datos del formulario
  const [error, setError] = useState(null); // Estado para manejar los errores
  const [success, setSuccess] = useState(null); // Estado para manejar los mensajes de éxito

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario de registro
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/users/', formData)
      .then(response => {
        setSuccess('User registered successfully!');
        setError(null);
        setFormData({
          username: '',
          password: '',
        }); // Restablecer los campos del formulario
      })
      .catch(error => {
        console.error('There was an error registering the user!', error);
        setError('Hubo un error al registrar al usuario. Por favor, inténtalo de nuevo más tarde.');
        setSuccess(null);
      });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>User Register</Typography>
      {error && <Alert severity="error">{error}</Alert>} {/* Mostrar mensaje de error si existe */}
      {success && <Alert severity="success">{success}</Alert>} {/* Mostrar mensaje de éxito si existe */}
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
          Register
        </Button>
      </form>
    </Container>
  );
}

export default UserRegister;