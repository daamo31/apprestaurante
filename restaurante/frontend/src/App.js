// src/App.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios'; // Importa Axios
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider
import Menu from './components/Menu';
import EmployeeSection from './components/EmployeeSection';
import UserAccess from './components/UserAccess';
import EmployeeLogin from './components/EmployeeLogin';
import EmployeeRegister from './components/EmployeeRegister';
import ManageReservations from './components/ManageReservations';
import CreateDish from './components/CreateDish';
import Reservations from './components/Reservations';
import Dishes from './components/Dishes';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import ManageUsers from './components/ManageUsers';
import TableMap from './components/TableMap';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';
import './assets/App.css';


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
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer); // Limpiar el intervalo al desmontar el componente
  }, []);

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
            {weather && (
              <Typography variant="h6" style={{ marginRight: '20px' }}>
                {weather.description}, {weather.temperature}°C
              </Typography>
            )}
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