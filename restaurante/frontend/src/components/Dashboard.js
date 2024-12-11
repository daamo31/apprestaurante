// src/Dashboard.js

// Importaciones necesarias desde React, React Router y Material-UI
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Typography, Button, Grid } from '@mui/material';

// Componente principal del Dashboard
function Dashboard() {
  const navigate = useNavigate();
  const { isEmployeeLoggedIn } = useAuth();

  // Si el usuario no ha iniciado sesión como empleado, muestra un mensaje de advertencia
  if (!isEmployeeLoggedIn) {
    return <h2>Debes iniciar sesión como empleado para acceder a esta sección.</h2>;
  }

  // Funciones para manejar la navegación a diferentes secciones del Dashboard
  const handleCreateDish = () => {
    navigate('/create-dish');
  };

  const handleViewManageReservations = () => {
    navigate('/manage-reservations');
  };

  const handleViewDishes = () => {
    navigate('/dishes');
  };

  const handleCreateUser = () => {
    navigate('/create-user');
  };

  // Renderizado del componente Dashboard
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <Button onClick={handleCreateDish} variant="contained" color="primary" fullWidth>
            Crear Plato
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button onClick={handleViewDishes} variant="contained" color="primary" fullWidth>
            Ver Platos
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button onClick={handleViewManageReservations} variant="contained" color="primary" fullWidth>
            Ver Reservas
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button onClick={handleCreateUser} variant="contained" color="primary" fullWidth>
            Crear Usuario
          </Button>
        </Grid>
        <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/staff.jpeg" alt="Dashboard" style={{ width: '30%', height: 'auto', marginBottom: '20px' }} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;