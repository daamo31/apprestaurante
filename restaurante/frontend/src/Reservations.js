import React, { useState } from 'react';
import axios from 'axios';

function Reservations() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 1,
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
    console.log(formData); // Verifica los datos antes de enviarlos
    axios.post('http://localhost:8000/api/reservations/', formData)
      .then(response => {
        alert('Reservation made successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: 1,
        });
      })
      .catch(error => {
        console.error('There was an error making the reservation!', error);
        setError('Hubo un error al hacer la reserva. Por favor, inténtalo de nuevo más tarde.');
      });
  };

  return (
    <div>
      <h2>Make a Reservation</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        <input type="number" name="guests" placeholder="Number of Guests" value={formData.guests} onChange={handleChange} required min="1" />
        <button type="submit">Reserve</button>
      </form>
    </div>
  );
}

export default Reservations;