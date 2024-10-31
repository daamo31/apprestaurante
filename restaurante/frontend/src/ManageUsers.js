// src/ManageUsers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    axios.post('http://localhost:8000/api/orders/', { dishes: order }, {
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
    <div>
      <h2>Manage Users</h2>
      {error && <p className="error">{error}</p>}
      <h3>Carta</h3>
      <ul>
        {dishes.map(dish => (
          <li key={dish.id}>
            {dish.name} - ${dish.price}
            <button onClick={() => handleAddToOrder(dish)}>Add to Order</button>
          </li>
        ))}
      </ul>
      <h3>Your Order</h3>
      <ul>
        {order.map((dish, index) => (
          <li key={index}>{dish.name} - ${dish.price}</li>
        ))}
      </ul>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}

export default ManageUsers;