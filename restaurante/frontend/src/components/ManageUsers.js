import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, List, ListItem, ListItemText, Alert } from '@mui/material';
import { Link } from 'react-router-dom'; 

function ManageUsers() {
  const [dishes, setDishes] = useState([]);
  const [order, setOrder] = useState([]);
  const [error, setError] = useState(null);

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

  const handleAddToOrder = (dish) => {
    setOrder([...order, dish]);
  };

  const handlePlaceOrder = () => {
    const token = localStorage.getItem('access_token');
    const dishIds = order.map(dish => dish.id); // Obtener solo los IDs de los platos
    axios.post('http://localhost:8000/api/orders/', { dishes: dishIds }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        alert('Order placed successfully!');
        setOrder([]);
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
            <ListItemText primary={`${dish.name} - $${dish.price}`} />
            <Button variant="contained" color="primary" onClick={() => handleAddToOrder(dish)}>Add to Order</Button>
          </ListItem>
        ))}
      </List>
      <Typography variant="h5" gutterBottom>Your Order</Typography>
      <List>
        {order.map((dish, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${dish.name} - $${dish.price}`} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handlePlaceOrder}>Place Order</Button>
      <Button variant="contained" color="primary" component={Link} to="/reservations">Hacer Reserva</Button>
    </Container>
  );
}

export default ManageUsers;