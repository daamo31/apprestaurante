import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button, TextField, Alert } from '@mui/material';

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [editReservation, setEditReservation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/reservations/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
      .then(response => {
        setReservations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the reservations!', error);
        setError('Hubo un error al obtener las reservas. Por favor, inténtalo de nuevo más tarde.');
      });
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
    <Container>
      <Typography variant="h4" gutterBottom>Manage Reservations</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <List>
        {reservations.map(reservation => (
          <ListItem key={reservation.id}>
            <ListItemText primary={`${reservation.name} - ${reservation.date} at ${reservation.time}`} />
            <Button variant="contained" color="primary" onClick={() => handleEdit(reservation)}>Edit</Button>
            <Button variant="contained" color="secondary" onClick={() => handleDelete(reservation.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
      {editReservation && (
        <form onSubmit={handleUpdate}>
          <TextField
            label="Name"
            name="name"
            value={editReservation.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={editReservation.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={editReservation.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={editReservation.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="Time"
            name="time"
            type="time"
            value={editReservation.time}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="Guests"
            name="guests"
            type="number"
            value={editReservation.guests}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary">Update Reservation</Button>
        </form>
      )}
    </Container>
  );
}

export default ManageReservations;

