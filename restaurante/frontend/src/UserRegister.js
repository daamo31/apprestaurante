// src/UserRegister.js
import React, { useState } from 'react';
import axios from 'axios';

function UserRegister() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    axios.post('http://localhost:8000/api/users/', formData)
      .then(response => {
        alert('User registered successfully!');
        setFormData({
          username: '',
          password: '',
        });
      })
      .catch(error => {
        console.error('There was an error registering the user!', error);
        setError('Hubo un error al registrar al usuario. Por favor, inténtalo de nuevo más tarde.');
      });
  };

  return (
    <div>
      <h2>Register User</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default UserRegister;