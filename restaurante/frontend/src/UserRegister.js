import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';

function UserRegister() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/users/', formData)
      .then(response => {
        setSuccess('User registered successfully!');
        setError(null);
        setFormData({
          username: '',
          password: '',
        });
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
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
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