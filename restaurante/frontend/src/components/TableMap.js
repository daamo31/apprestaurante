import React from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';
import { tables } from '../config/tablesConfig';

function TableMap({ reservations, setReservations, setError, selectedTable, setSelectedTable, selectedDate, guests }) {
  // Función para manejar la selección de una mesa
  const handleTableSelect = (tableId, seats) => {
    if (guests > seats) {
      setError('El número de comensales es mayor que los asientos disponibles en la mesa seleccionada.');
      return;
    }
    setSelectedTable(tableId);
  };

  // Función para obtener la reserva de una mesa específica
  const getTableReservation = (tableId) => {
    return reservations.find(reservation => reservation.table_id === tableId && reservation.date === selectedDate);
  };

  return (
    <Grid container spacing={2}>
      {tables.map((table) => {
        const reservation = getTableReservation(table.id);
        const isReserved = !!reservation;
        const backgroundColor = isReserved ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)';

        return (
          <Grid item key={table.id} xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              style={{
                padding: '10px',
                backgroundColor: selectedTable === table.id ? 'lightblue' : backgroundColor,
                opacity: guests > table.seats ? 0.5 : 1, // Desenfocar si los comensales son mayores que los asientos
              }}
            >
              <Typography variant="h6">Mesa {table.id}</Typography>
              <Typography variant="body1">Asientos: {table.seats}</Typography>
              {isReserved && (
                <Typography variant="body2">
                  Reservado por: {reservation.name} - {reservation.time}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleTableSelect(table.id, table.seats)}
                disabled={guests > table.seats} // Deshabilitar el botón si los comensales son mayores que los asientos
              >
                Seleccionar
              </Button>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default TableMap;