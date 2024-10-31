// src/UserLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/users/login/', formData)
      .then(response => {
        localStorage.setItem('access_token', response.data.access);
        alert('User logged in successfully!');
        navigate('/manage-users'); // Redirigir a ManageUsers
      })
      .catch(error => {
        console.error('There was an error logging in the user!', error);
        setError('Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
      });
  };

  return (
    <div>
      <h2>User Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default UserLogin;