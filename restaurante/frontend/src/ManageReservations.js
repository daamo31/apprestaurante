import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateDish from './CreateDish';

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [editReservation, setEditReservation] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/reservations/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setReservations(response.data);
      } catch (error) {
        console.error('There was an error fetching the reservations!', error);
        setError('Hubo un error al obtener las reservas. Por favor, inténtalo de nuevo más tarde.');
      }
    };

    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/reservations/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setReservations(reservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error('There was an error deleting the reservation!', error);
      setError('Hubo un error al eliminar la reserva. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleEdit = (reservation) => {
    setEditReservation(reservation);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/reservations/${editReservation.id}/`, editReservation, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setReservations(reservations.map(reservation => reservation.id === editReservation.id ? editReservation : reservation));
      setEditReservation(null);
    } catch (error) {
      console.error('There was an error updating the reservation!', error);
      setError('Hubo un error al actualizar la reserva. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const handleChange = (e) => {
    setEditReservation({
      ...editReservation,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Manage Reservations</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {reservations.map(reservation => (
          <li key={reservation.id}>
            {reservation.name} - {reservation.date} at {reservation.time}
            <button onClick={() => handleEdit(reservation)}>Edit</button>
            <button onClick={() => handleDelete(reservation.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {editReservation && (
        <form onSubmit={handleUpdate}>
          <input type="text" name="name" value={editReservation.name} onChange={handleChange} required />
          <input type="email" name="email" value={editReservation.email} onChange={handleChange} required />
          <input type="text" name="phone" value={editReservation.phone} onChange={handleChange} required />
          <input type="date" name="date" value={editReservation.date} onChange={handleChange} required />
          <input type="time" name="time" value={editReservation.time} onChange={handleChange} required />
          <input type="number" name="guests" value={editReservation.guests} onChange={handleChange} required />
          <button type="submit">Update Reservation</button>
        </form>
      )}
      <CreateDish />
    </div>
  );
}

export default ManageReservations;

