// src/Dishes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

function Dishes() {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/dishes/')
      .then(response => {
        setDishes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the dishes!', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dishes</Typography>
      <List>
        {dishes.map(dish => (
          <ListItem key={dish.id}>
            <ListItemText primary={`${dish.name} - $${dish.price}`} secondary={dish.description} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Dishes;