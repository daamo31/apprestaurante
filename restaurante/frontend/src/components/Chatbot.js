// src/Chatbot.js

// Importaciones necesarias desde React y Material-UI
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box } from '@mui/material';

// Componente principal del chatbot
const Chatbot = () => {
  // Estados para manejar el estado del chatbot, mensajes, inicio de sesión y reservas
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [reservationData, setReservationData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
  });
  const [isReservationMade, setIsReservationMade] = useState(false);

  // Efecto para manejar el estado de inicio de sesión
  useEffect(() => {
    if (isLoggedIn) {
      setIsLoggingIn(false);
    }
  }, [isLoggedIn]);

  // Función para enviar un mensaje al chatbot
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newResponses = [...responses, { from: 'user', text: message }];
    setResponses(newResponses);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8888/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setResponses([...newResponses, { from: 'chatbot', text: data.response }]);

      if (data.response.includes('iniciar sesión')) {
        setIsLoggingIn(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Función para manejar cambios en los campos de inicio de sesión
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario de inicio de sesión
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        setResponses([...responses, { from: 'chatbot', text: 'Inicio de sesión exitoso. Ahora puedes hacer una reserva.' }]);
        setIsLoggedIn(true);
      } else {
        setResponses([...responses, { from: 'chatbot', text: 'Error en el inicio de sesión. Por favor, verifica tus credenciales.' }]);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setResponses([...responses, { from: 'chatbot', text: 'Error en el inicio de sesión. Por favor, inténtalo de nuevo más tarde.' }]);
    }
  };

  // Función para manejar cambios en los campos de reserva
  const handleReservationChange = (e) => {
    setReservationData({
      ...reservationData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario de reserva
  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://localhost:8000/api/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });
      const data = await response.json();
      if (response.ok) {
        setResponses([...responses, { from: 'chatbot', text: 'Reserva realizada con éxito.' }]);
        setReservationData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '',
        });
        setIsReservationMade(true);
        setTimeout(() => {
          setIsReservationMade(false);
          setMessage('');
          setIsLoggedIn(false);
          setLoginData({ username: '', password: '' });
          setResponses([]);
          handleClose();
          setTimeout(() => handleOpen(), 100); // Reabrir el chatbot después de cerrarlo
        }, 2000); // Restablecer el estado después de 2 segundos y cerrar el chatbot
      } else {
        setResponses([...responses, { from: 'chatbot', text: 'Error al realizar la reserva. Por favor, inténtalo de nuevo más tarde.' }]);
      }
    } catch (error) {
      console.error('Error during reservation:', error);
      setResponses([...responses, { from: 'chatbot', text: 'Error al realizar la reserva. Por favor, inténtalo de nuevo más tarde.' }]);
    }
  };

  // Función para abrir el chatbot
  const handleOpen = () => {
    setOpen(true);
    setMessage('');
    setResponses([{ from: 'chatbot', text: '¡Bienvenido! ¿En qué puedo ayudarte hoy?' }]);
    setIsLoggingIn(false);
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
    setReservationData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: '',
    });
    setIsReservationMade(false);
  };

  // Función para cerrar el chatbot
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Botón para abrir el chatbot */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <img src="/chatbot.jpeg" alt="Chatbot" style={{ width: 60, height: 60, cursor: 'pointer' }} onClick={handleOpen} />
      </Box>
      {/* Diálogo del chatbot */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: 0,
            right: 0,
            m: 0,
            width: '300px',
            height: '400px',
          },
        }}
      >
        <DialogTitle>
          Chatbot
        </DialogTitle>
        <DialogContent>
          <div style={{ height: '300px', overflowY: 'auto' }}>
            {responses.map((res, index) => (
              <div key={index} style={{ textAlign: res.from === 'user' ? 'right' : 'left' }}>
                <p><strong>{res.from === 'user' ? 'Tú' : 'Chatbot'}:</strong> <span dangerouslySetInnerHTML={{ __html: res.text }} /></p>
              </div>
            ))}
          </div>
          {isLoggingIn ? (
            <form onSubmit={handleLoginSubmit}>
              <TextField
                label="Nombre de usuario"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleLoginChange}
                fullWidth
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Iniciar Sesión
              </Button>
            </form>
          ) : isLoggedIn && !isReservationMade ? (
            <form onSubmit={handleReservationSubmit}>
              <TextField
                label="Nombre"
                name="name"
                value={reservationData.name}
                onChange={handleReservationChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={reservationData.email}
                onChange={handleReservationChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Teléfono"
                name="phone"
                value={reservationData.phone}
                onChange={handleReservationChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Fecha"
                name="date"
                type="date"
                value={reservationData.date}
                onChange={handleReservationChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              <TextField
                label="Hora"
                name="time"
                type="time"
                value={reservationData.time}
                onChange={handleReservationChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              <TextField
                label="Número de Invitados"
                name="guests"
                type="number"
                value={reservationData.guests}
                onChange={handleReservationChange}
                fullWidth
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Hacer Reserva
              </Button>
            </form>
          ) : isReservationMade ? (
            <p>Reserva realizada con éxito.</p>
          ) : (
            <TextField
              label="Escribe un mensaje"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;