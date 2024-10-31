// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Menu from './Menu';
import EmployeeSection from './EmployeeSection';
import UserAccess from './UserAccess';
import EmployeeLogin from './EmployeeLogin';
import EmployeeRegister from './EmployeeRegister';
import ManageReservations from './ManageReservations';
import CreateDish from './CreateDish';
import Reservations from './Reservations';
import Dishes from './Dishes';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import ManageUsers from './ManageUsers';

function App() {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Restaurante
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/menu">Menú</Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route exact path="/" element={
              <>
                <Typography variant="h4" gutterBottom>Bienvenido a nuestro Restaurante</Typography>
                <Dishes />
                <Button variant="contained" color="primary" component={Link} to="/reservations">Hacer Reserva</Button>
              </>
            } />
            <Route path="/menu" element={<Menu />} />
            <Route path="/dishes" element={<Dishes />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/employee-section" element={<EmployeeSection />} />
            <Route path="/user-access" element={<UserAccess />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/employee-register" element={<EmployeeRegister />} />
            <Route path="/user-access" element={<UserAccess />} />
            <Route path="/create-dish" element={<CreateDish />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/user-register" element={<UserRegister />} />
            <Route path="/manage-reservations" element={<ManageReservations />} />
            <Route path="/manage-users" element={<ManageUsers />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;