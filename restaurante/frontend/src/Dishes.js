// src/Dishes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dishes() {
  const [dishes, setDishes] = useState([]);
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

  return (
    <div>
      <h2>Menu</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {dishes.map(dish => (
          <li key={dish.id}>{dish.name} - ${dish.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dishes;