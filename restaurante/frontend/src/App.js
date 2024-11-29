// src/App.js
import React, { useState, useEffect } from 'react';
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
import './App.css'; // Importa el archivo CSS

const AppBarStyled = styled(AppBar)({
  marginBottom: '20px',
  backgroundColor: '#333', // Cambia este color al que prefieras
});

const ContainerStyled = styled(Container)({
  marginTop: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semitransparente
  padding: '20px',
  borderRadius: '8px',
});

function App() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer); // Limpiar el intervalo al desmontar el componente
  }, []);

  const handleChatbotOpen = () => {
    setChatbotOpen(true);
  };

  const handleChatbotClose = () => {
    setChatbotOpen(false);
  };

  return (
    <AuthProvider>
      <div
        className="App"
        style={{
          textAlign: 'center',
          backgroundImage: 'url(/background-image.jpeg)', // Cambia esta ruta a la de tu imagen de fondo
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppBarStyled position="static">
        <Toolbar>
            <Typography variant="h6" style={{ marginRight: '20px' }}>
              {currentTime}
            </Typography>
             <Typography variant="h6" style={{ flexGrow: 1 }}>
               Restaurante Dani
            </Typography>
             <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/menu">Menú</Button>
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
        <footer style={{ marginTop: 'auto', padding: '10px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <Typography variant="body2" color="textSecondary">
            © 2024 Restaurante Dani. Todos los derechos reservados.
          </Typography>
        </footer>
        <Chatbot open={chatbotOpen} handleClose={handleChatbotClose} /> {/* Componente del chatbot */}
      </div>
    </AuthProvider>
  );
}

export default App;