import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

function ManageUsers() {
  const { user } = useAuth(); // Obtén el usuario logueado desde el contexto de autenticación
  const [dishes, setDishes] = useState([]); // Estado para manejar la lista de platos
  const [order, setOrder] = useState([]); // Estado para manejar el pedido actual
  const [error, setError] = useState(null); // Estado para manejar los errores
  const [open, setOpen] = useState(false); // Estado para manejar la visibilidad del diálogo
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  }); // Estado para manejar los datos del cliente

  // Efecto para obtener los platos desde el servidor al montar el componente
  useEffect(() => {
    axios.get('http://localhost:8000/api/dishes/')
      .then(response => {
        setDishes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the dishes!', error);
        setError('Hubo un error al obtener los platos. Por favor, inténtalo de nuevo más tarde.');
      });
  }, []);

  // Efecto para actualizar el nombre del cliente cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      setCustomerData(prevData => ({
        ...prevData,
        name: user.username
      }));
    }
  }, [user]);

  // Función para agregar un plato al pedido
  const handleAddToOrder = (dish) => {
    setOrder([...order, dish]);
  };

  // Función para abrir el diálogo
  const handleOpenDialog = () => {
    setOpen(true);
  };

  // Función para cerrar el diálogo
  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value
    });
  };

  // Función para realizar el pedido
  const handlePlaceOrder = () => {
    const token = localStorage.getItem('access_token');
    const dishIds = order.map(dish => dish.id); // Obtener solo los IDs de los platos
    axios.post('http://localhost:8000/api/orders/', { 
      dishes: dishIds,
      customer: customerData
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        alert('Order placed successfully!');
        setOrder([]);
        handleCloseDialog();
      })
      .catch(error => {
        console.error('There was an error placing the order!', error);
        setError('Hubo un error al realizar el pedido. Por favor, inténtalo de nuevo más tarde.');
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manage Users</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h5" gutterBottom>Carta</Typography>
      <List>
        {dishes.map(dish => (
          <ListItem key={dish.id}>
            <ListItemAvatar>
              <Avatar src={dish.image} alt={dish.name} />
            </ListItemAvatar>
            <ListItemText primary={`${dish.name} - $${dish.price}`} />
            <Button variant="contained" color="primary" onClick={() => handleAddToOrder(dish)}>Add to Order</Button>
          </ListItem>
        ))}
      </List>
      <Typography variant="h5" gutterBottom>Your Order</Typography>
      <List>
        {order.map((dish, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar src={dish.image} alt={dish.name} />
            </ListItemAvatar>
            <ListItemText primary={`${dish.name} - $${dish.price}`} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>Place Order</Button>
      <Button variant="contained" color="primary" component={Link} to="/reservations">Hacer Reserva</Button>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Place Order</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>Order Summary</Typography>
          <List>
            {order.map((dish, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={dish.image} alt={dish.name} />
                </ListItemAvatar>
                <ListItemText primary={`${dish.name} - $${dish.price}`} />
              </ListItem>
            ))}
          </List>
          <TextField
            label="Name"
            name="name"
            value={customerData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={customerData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={customerData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Address"
            name="address"
            value={customerData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handlePlaceOrder} color="primary">Place Order</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ManageUsers;