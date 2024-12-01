import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, Button } from '@mui/material';

function UserAccess() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Sección de Acceso a Usuarios</Typography>
      <List>
        <ListItem>
          <Button component={Link} to="/user-login" variant="contained" color="primary" fullWidth>
            Login de Usuarios
          </Button>
        </ListItem>
        <ListItem>
          <Button component={Link} to="/user-register" variant="contained" color="secondary" fullWidth>
            Crear Usuario
          </Button>
        </ListItem>
      </List>
    </Container>
  );
}

export default UserAccess;