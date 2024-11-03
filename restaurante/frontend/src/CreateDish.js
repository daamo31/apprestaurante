// src/CreateDish.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Alert } from '@mui/material';

function CreateDish() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Fetch dish data if editing an existing dish
    const fetchDish = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/dishes/1'); // Replace with actual dish ID
        setFormData(response.data);
      } catch (error) {
        console.error('There was an error fetching the dish!', error);
      }
    };

    fetchDish();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/dishes/', formData)
      .then(response => {
        setSuccess('Dish created successfully!');
        setError(null);
        setFormData({
          name: '',
          description: '',
          price: '',
        });
      })
      .catch(error => {
        console.error('There was an error creating the dish!', error);
        setError('Hubo un error al crear el plato. Por favor, inténtalo de nuevo más tarde.');
        setSuccess(null);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Create Dish</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create
        </Button>
      </form>
    </Container>
  );
}

export default CreateDish;