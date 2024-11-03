import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Alert, MenuItem, Grid, Paper } from '@mui/material';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { tables } from './tablesConfig';
import TableMap from './TableMap'; // Importar el componente TableMap

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Typography variant="body1">
        {props.reservation.name} - {props.reservation.date} at {props.reservation.time}
      </Typography>
    </div>
  );
}

function Reservations() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
  });
  const [reservations, setReservations] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null); // Definir selectedTable y setSelectedTable
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    axios.get('http://localhost:8000/api/reservations/', {
      headers: {
        Authorization: `Bearer ${token}`
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservationTime = formData.time;
    const [hours] = reservationTime.split(':').map(Number);
    const isValidTime = (hours >= 12 && hours < 15) || (hours >= 20 && hours < 23);

    if (!isValidTime) {
      setError('Las reservas solo se pueden hacer entre las 12:00 y las 15:00, y entre las 20:00 y las 23:00.');
      setSuccess(null);
      return;
    }

    const token = localStorage.getItem('access_token');

    axios.post('http://localhost:8000/api/reservations/', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const newReservation = response.data;
        setSuccess('Reserva realizada con éxito.');
        setError(null);
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '',
        });
        setReservations([...reservations, newReservation]);
      })
      .catch(error => {
        console.error('There was an error making the reservation!', error);
        setError('Hubo un error al realizar la reserva. Por favor, inténtalo de nuevo más tarde.');
        setSuccess(null);
      });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setReservations((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const availableTimes = [
    '12:00', '12:10', '12:20', '12:30', '12:40', '12:50',
    '13:00', '13:10', '13:20', '13:30', '13:40', '13:50',
    '14:00', '14:10', '14:20', '14:30', '14:40', '14:50',
    '20:00', '20:10', '20:20', '20:30', '20:40', '20:50',
    '21:00', '21:10', '21:20', '21:30', '21:40', '21:50',
    '22:00', '22:10', '22:20', '22:30', '22:40', '22:50'
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Hacer Reserva</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Teléfono"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Fecha"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: getMinDate(),
          }}
          required
        />
        <TextField
          label="Hora"
          name="time"
          select
          value={formData.time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {availableTimes.map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Número de Invitados"
          name="guests"
          type="number"
          value={formData.guests}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Hacer Reserva
        </Button>
      </form>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={reservations} strategy={verticalListSortingStrategy}>
          <Typography variant="h5" gutterBottom>Reservas</Typography>
          {reservations.map((reservation) => (
            <SortableItem key={reservation.id} id={reservation.id} reservation={reservation} />
          ))}
        </SortableContext>
      </DndContext>
      <Typography variant="h5" gutterBottom>Mesas</Typography>
      <Grid container spacing={2}>
        {tables.map((table) => (
          <Grid item xs={3} key={table.id}>
            <Paper
              elevation={3}
              style={{
                padding: '10px',
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              <Typography variant="h6">Mesa {table.id}</Typography>
              <Typography variant="body1">Asientos: {table.seats}</Typography>
              {reservations.filter(reservation => reservation.table_id === table.id).map(reservation => (
                <Typography key={reservation.id} variant="body2">
                  {reservation.name} - {reservation.date} at {reservation.time}
                </Typography>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <TableMap
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        guests={formData.guests}
        reservations={reservations}
        setReservations={setReservations} // Pasar setReservations como prop
      />
    </Container>
  );
}

export default Reservations;