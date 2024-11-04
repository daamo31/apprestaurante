import React from 'react';
import axios from 'axios';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { tables } from './tablesConfig';

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

function TableMap({ selectedTable, setSelectedTable, guests, reservations, setReservations, selectedDate, setError }) { // Asegúrate de recibir setError como prop
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const reservationId = parseInt(active.id, 10);
    const tableId = parseInt(over.id.replace('table-', ''), 10);

    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, table_id: tableId } : reservation
      )
    );

    // Enviar una solicitud al servidor para actualizar la reserva con la nueva mesa
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

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tables} strategy={verticalListSortingStrategy}>
        <Grid container spacing={2}>
          {tables.map((table) => {
            const tableReservations = reservations.filter(reservation => reservation.table_id === table.id && (!selectedDate || reservation.date === selectedDate));
            const hasReservations = tableReservations.length > 0;
            return (
              <Grid item xs={3} key={table.id}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '10px',
                    backgroundColor: hasReservations ? 'red' : 'green',
                    color: 'black',
                  }}
                  id={`table-${table.id}`}
                  onClick={() => setSelectedTable(table.id)} // Seleccionar la mesa al hacer clic
                >
                  <Typography variant="h6">Mesa {table.id}</Typography>
                  <Typography variant="body1">Asientos: {table.seats}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={table.seats < guests}
                    onClick={() => setSelectedTable(table.id)}
                  >
                    Seleccionar
                  </Button>
                  {tableReservations.map(reservation => (
                    <SortableItem key={reservation.id} id={reservation.id.toString()} reservation={reservation} />
                  ))}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </SortableContext>
    </DndContext>
  );
}

export default TableMap; 