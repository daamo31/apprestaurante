// src/CreateDish.js
import React, { useState } from 'react';
import axios from 'axios';

function CreateDish() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [error, setError] = useState(null);

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
        alert('Dish created successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
        });
      })
      .catch(error => {
        console.error('There was an error creating the dish!', error);
        setError('Hubo un error al crear el plato. Por favor, inténtalo de nuevo más tarde.');
      });
  };

  return (
    <div>
      <h2>Create Dish</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateDish;