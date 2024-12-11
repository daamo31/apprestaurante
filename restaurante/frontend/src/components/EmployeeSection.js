import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, Button, Grid, TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EmployeeSection() {
  const { isEmployeeLoggedIn, loginEmployee } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmployeeLoggedIn) {
      navigate('/dashboard');
    }
  }, [isEmployeeLoggedIn, navigate]);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

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
    <Container>
      <Typography variant="h4" gutterBottom>Sección de Empleados</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <List>
            {!showLogin && (
              <ListItem>
                <Button onClick={handleLoginClick} variant="contained" color="primary" fullWidth>
                  Login de Empleados
                </Button>
              </ListItem>
            )}
          </List>
          {showLogin && (
            <form onSubmit={handleLogin}>
              {error && <Alert severity="error">{error}</Alert>}
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
                Iniciar Sesión
              </Button>
            </form>
          )}
        </Grid>
        <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/staff.jpeg" alt="Employee Section" style={{ width: '30%', height: 'auto', marginBottom: '20px' }} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default EmployeeSection;