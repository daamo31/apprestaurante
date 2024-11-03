import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import TableMap from './TableMap';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [editReservation, setEditReservation] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
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

    if (active.id !== over.id) {
      setReservations((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestionar Reservas</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={reservations} strategy={verticalListSortingStrategy}>
          <Typography variant="h5" gutterBottom>Reservas</Typography>
          {reservations.map((reservation) => (
            <SortableItem key={reservation.id} id={reservation.id} reservation={reservation} />
          ))}
        </SortableContext>
      </DndContext>
      <TableMap
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        guests={editReservation ? editReservation.guests : 0}
        reservations={reservations}
        setReservations={setReservations}
      />
    </Container>
  );
}

export default ManageReservations;