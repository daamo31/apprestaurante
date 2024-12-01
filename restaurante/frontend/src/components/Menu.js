// src/Menu.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, Button } from '@mui/material';

function Menu() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Menú</Typography>
      <List>
        <ListItem>
          <Button component={Link} to="/employee-section" variant="contained" color="primary" fullWidth>
            Sección de Empleados
          </Button>
        </ListItem>
        <ListItem>
          <Button component={Link} to="/user-access" variant="contained" color="secondary" fullWidth>
            Sección de Acceso a Usuarios
          </Button>
        </ListItem>
      </List>
    </Container>
  );
}

export default Menu;