import React, { useEffect } from 'react';
import { Container, Typography, List, ListItem, Button, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EmployeeSection() {
  const { isEmployeeLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmployeeLoggedIn) {
      navigate('/dashboard');
    }
  }, [isEmployeeLoggedIn, navigate]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Sección de Empleados</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <List>
            <ListItem>
              <Button component={Link} to="/employee-login" variant="contained" color="primary" fullWidth>
                Login de Empleados
              </Button>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <img src="/staff.jpeg" alt="Employee Section" style={{ width: '30%', height: 'auto', marginBottom: '20px' }} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default EmployeeSection;