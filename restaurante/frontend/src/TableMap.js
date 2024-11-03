import React from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
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

function TableMap({ selectedTable, setSelectedTable, guests, reservations, setReservations }) {
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
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tables} strategy={verticalListSortingStrategy}>
        <Grid container spacing={2}>
          {tables.map((table) => (
            <Grid item xs={3} key={table.id}>
              <Paper
                elevation={3}
                style={{
                  padding: '10px',
                  backgroundColor: selectedTable === table.id ? 'lightgreen' : 'white',
                  color: selectedTable === table.id ? 'black' : 'white',
                }}
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
                {reservations.filter(reservation => reservation.table_id === table.id).map(reservation => (
                  <SortableItem key={reservation.id} id={reservation.id} reservation={reservation} />
                ))}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </SortableContext>
    </DndContext>
  );
}

export default TableMap;