import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, List, ListItem, Button, Container } from '@mui/material';

function EmployeeSection() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Sección de Empleados</Typography>
      <List>
        <ListItem>
          <Button component={Link} to="/employee-login" variant="contained" color="primary">
            Login de Empleados
          </Button>
        </ListItem>
        <ListItem>
          <Button component={Link} to="/employee-register" variant="contained" color="secondary">
            Crear Empleado
          </Button>
        </ListItem>
      </List>
    </Container>
  );
}

export default EmployeeSection;