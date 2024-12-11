// src/App.js

// Importaciones necesarias desde React, Material-UI, Axios y React Router
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './assets/App.css';
import Chatbot from './components/Chatbot';
import CreateDish from './components/CreateDish';
import Dashboard from './components/Dashboard';
import Dishes from './components/Dishes';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeRegister from './components/EmployeeRegister';
import EmployeeSection from './components/EmployeeSection';
import ManageReservations from './components/ManageReservations';
import ManageUsers from './components/ManageUsers';
import Menu from './components/Menu';
import Reservations from './components/Reservations';
import TableMap from './components/TableMap';
import UserAccess from './components/UserAccess';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider

// Estilos personalizados para AppBar y Container utilizando Material-UI
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

// Componente principal de la aplicación
function App() {
  // Estados para manejar el estado del chatbot, la hora actual y el clima
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [weather, setWeather] = useState(null);

  // Efecto para actualizar la hora actual cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer); // Limpiar el intervalo al desmontar el componente
  }, []);

  // Efecto para obtener los datos del clima desde un servidor
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get('http://localhost:5500/weather', {
          headers: {
            'Accept': 'application/json',
          },
        });
        
        const data = response.data;
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, []);

  // Función para cerrar el chatbot
  const handleChatbotClose = () => {
    setChatbotOpen(false);
  };

  return (
    // Proveedor de contexto de autenticación que envuelve toda la aplicación
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
        {/* Barra de navegación superior */}
        <AppBarStyled position="static">
          <Toolbar>
            <Typography variant="h6" style={{ marginRight: '20px' }}>
              {currentTime}
            </Typography>
            {weather && (
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <img src={weather.icon} alt="Weather Icon" style={{ marginRight: '10px' }} />
                <Typography variant="h6">
                  {weather.temperature}°C
                </Typography>
              </div>
            )}
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Restaurante Dani
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/menu">Menú</Button>
          </Toolbar>
        </AppBarStyled>

        {/* Contenedor principal de la aplicación */}
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

        {/* Pie de página */}
        <footer style={{ marginTop: 'auto', padding: '10px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <Typography variant="body2" color="textSecondary">
            © 2024 Restaurante Dani. Todos los derechos reservados.
          </Typography>
        </footer>

        {/* Componente del chatbot */}
        <Chatbot open={chatbotOpen} handleClose={handleChatbotClose} />
      </div>
    </AuthProvider>
  );
}

export default App;