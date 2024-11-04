import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Alert, TextField } from '@mui/material';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TableMap from './TableMap'; // Importar el componente TableMap
import { tables } from './tablesConfig'; // Importar la configuración de las mesas

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
        {props.reservation.name} - {props.reservation.date} at {props.reservation.time} - {props.reservation.guests} comensales - Mesa {props.reservation.table_id}
      </Typography>
    </div>
  );
}

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedDate, setSelectedDate] = useState(''); // Estado para la fecha seleccionada
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
        setError('Hubo un error al obtener las reservas. Por favor, inténtalo de nuevo más tarde.');
      });
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const reservationId = parseInt(active.id, 10);
    const tableId = selectedTable;

    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, table_id: tableId } : reservation
      )
    );

    // Enviar una solicitud al servidor para actualizar la reserva con la mesa seleccionada
    axios.put(`http://localhost:8000/api/reservations/${reservationId}/`, { table_id: tableId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
      .then(response => {
        console.log('Reserva actualizada con éxito');
      })
      .catch(error => {
        console.error('Hubo un error al actualizar la reserva', error);
        setError('Hubo un error al actualizar la reserva. Por favor, inténtalo de nuevo más tarde.');
      });
  };

  const filteredReservations = selectedDate
    ? reservations.filter(reservation => reservation.date === selectedDate)
    : reservations;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestionar Reservas</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Fecha"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        margin="normal"
      />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredReservations} strategy={verticalListSortingStrategy}>
          <Typography variant="h5" gutterBottom>Reservas</Typography>
          {filteredReservations.map((reservation) => (
            <SortableItem key={reservation.id} id={reservation.id.toString()} reservation={reservation} />
          ))}
        </SortableContext>
      </DndContext>
      <TableMap
        reservations={filteredReservations}
        setReservations={setReservations}
        setError={setError} // Pasar setError como prop
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable} // Pasar setSelectedTable como prop
        selectedDate={selectedDate} // Pasar selectedDate como prop
        guests={filteredReservations.length > 0 ? filteredReservations[0].guests : 0} // Pasar el número de comensales como prop
      />
    </Container>
  );
}

export default ManageReservations;