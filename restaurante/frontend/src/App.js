// src/App.js
import React, { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/system';
import { AuthProvider } from './AuthContext'; // Importa el AuthProvider
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
import TableMap from './TableMap';
import Chatbot from './Chatbot';
import Dashboard from './Dashboard';

const AppBarStyled = styled(AppBar)({
  marginBottom: '20px',
});

const ContainerStyled = styled(Container)({
  marginTop: '20px',
});

function App() {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const handleChatbotOpen = () => {
    setChatbotOpen(true);
  };

  const handleChatbotClose = () => {
    setChatbotOpen(false);
  };

  return (
    <AuthProvider>
      <div className="App">
        <AppBarStyled position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Restaurante
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/menu">Menú</Button>
            <Button color="inherit" onClick={handleChatbotOpen}>Chatbot</Button> {/* Botón para abrir el chatbot */}
          </Toolbar>
        </AppBarStyled>
        <ContainerStyled>
          <Routes>
            <Route exact path="/" element={
              <>
                <Typography variant="h4" gutterBottom>Bienvenido a nuestro Restaurante</Typography>
                <Dishes />
              </>
            } />
            <Route path="/menu" element={<Menu />} />
            <Route path="/dishes" element={<Dishes />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/employee-section" element={<EmployeeSection />} />
            <Route path="/user-access" element={<UserAccess />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/employee-register" element={<EmployeeRegister />} />
            <Route path="/create-dish" element={<CreateDish />} />
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/user-register" element={<UserRegister />} />
            <Route path="/manage-reservations" element={<ManageReservations />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/table-map" element={<TableMap />} />
          </Routes>
        </ContainerStyled>
        <Chatbot open={chatbotOpen} handleClose={handleChatbotClose} /> {/* Componente del chatbot */}
      </div>
    </AuthProvider>
  );
}

export default App;
