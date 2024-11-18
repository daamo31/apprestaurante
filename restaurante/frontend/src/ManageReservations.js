import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Alert, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TableMap from './TableMap';

/**
 * Componente para un ítem sortable (arrastrable).
 * @param {Object} props - Las propiedades del componente.
 */
function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column', // Cambia la dirección del flex a columna
    alignItems: 'flex-start', // Alinea los elementos al inicio
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '10px', // Añade un margen superior para separar los botones del contenido
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Typography variant="body1">
        {props.reservation.name} - {props.reservation.date} at {props.reservation.time} - {props.reservation.guests} comensales - Mesa {props.reservation.table_id}
      </Typography>
      {!props.hideButtons && (
        <div style={buttonContainerStyle}>
          <Button onClick={() => props.onEdit(props.reservation)}>Editar</Button>
          <Button onClick={() => props.onDelete(props.reservation.id)}>Eliminar</Button>
        </div>
      )}
    </div>
  );
}

/**
 * Componente para un ítem de reserva.
 * @param {Object} props - Las propiedades del componente.
 */
function ReservationItem(props) {
  const style = {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column', // Cambia la dirección del flex a columna
    alignItems: 'flex-start', // Alinea los elementos al inicio
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '10px', // Añade un margen superior para separar los botones del contenido
  };

  return (
    <div style={style}>
      <Typography variant="body1">
        {props.reservation.name} - {props.reservation.date} at {props.reservation.time} - {props.reservation.guests} comensales - Mesa {props.reservation.table_id}
      </Typography>
      {!props.hideButtons && (
        <div style={buttonContainerStyle}>
          <Button onClick={() => props.onEdit(props.reservation)}>Editar</Button>
          <Button onClick={() => props.onDelete(props.reservation.id)}>Eliminar</Button>
        </div>
      )}
    </div>
  );
}

/**
 * Componente principal para gestionar las reservas.
 */
function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedDate, setSelectedDate] = useState(''); // Estado para la fecha seleccionada
  const [error, setError] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null); // Estado para la reserva que se está editando

  // Efecto para obtener las reservas al cargar el componente
  useEffect(() => {
    axios.get('http://localhost:8000/api/reservations/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
      .then(response => {
        setReservations(response.data);
        removeExpiredReservations(response.data);
      })
      .catch(error => {
        setError('Hubo un error al obtener las reservas. Por favor, inténtalo de nuevo más tarde.');
      });
  }, []);

  /**
   * Función para eliminar reservas caducadas.
   * @param {Array} reservations - Lista de reservas.
   */
  const removeExpiredReservations = (reservations) => {
    const today = new Date().toISOString().split('T')[0];
    reservations.forEach(reservation => {
      if (reservation.date < today) {
        handleDelete(reservation.id);
      }
    });
  };

  /**
   * Función para manejar el final del arrastre.
   * @param {Object} event - Evento de arrastre.
   */
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

  /**
   * Función para manejar la edición de una reserva.
   * @param {Object} reservation - Reserva a editar.
   */
  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
  };

  /**
   * Función para manejar los cambios en el formulario de edición.
   * @param {Object} e - Evento de cambio.
   */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingReservation(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  /**
   * Función para guardar los cambios de la edición.
   */
  const handleEditSave = () => {
    axios.put(`http://localhost:8000/api/reservations/${editingReservation.id}/`, editingReservation, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
      .then(response => {
        setReservations(reservations.map(res => res.id === editingReservation.id ? response.data : res));
        setEditingReservation(null);
        console.log('Reserva actualizada con éxito');
      })
      .catch(error => {
        console.error('Hubo un error al actualizar la reserva', error);
        setError('Hubo un error al actualizar la reserva. Por favor, inténtalo de nuevo más tarde.');
      });
  };

  /**
   * Función para manejar la eliminación de una reserva.
   * @param {number} id - ID de la reserva a eliminar.
   */
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/reservations/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
      .then(response => {
        setReservations(reservations.filter(reservation => reservation.id !== id));
        console.log('Reserva eliminada con éxito');
      })
      .catch(error => {
        console.error('Hubo un error al eliminar la reserva', error);
        setError('Hubo un error al eliminar la reserva. Por favor, inténtalo de nuevo más tarde.');
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
      {selectedDate ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredReservations} strategy={verticalListSortingStrategy}>
            <Typography variant="h5" gutterBottom>Reservas</Typography>
            {filteredReservations.map((reservation) => (
              <SortableItem
                key={reservation.id}
                id={reservation.id.toString()}
                reservation={reservation}
                onEdit={handleEdit}
                onDelete={handleDelete}
                hideButtons={true}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>Reservas</Typography>
          {filteredReservations.map((reservation) => (
            <ReservationItem
              key={reservation.id}
              reservation={reservation}
              onEdit={handleEdit}
              onDelete={handleDelete}
              hideButtons={false}
            />
          ))}
        </>
      )}
      {selectedDate && (
        <TableMap
          reservations={filteredReservations}
          setReservations={setReservations}
          setError={setError} // Pasar setError como prop
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable} // Pasar setSelectedTable como prop
          selectedDate={selectedDate} // Pasar selectedDate como prop
          guests={filteredReservations.length > 0 ? filteredReservations[0].guests : 0} // Pasar el número de comensales como prop
        />
      )}
      {editingReservation && (
        <Dialog open={true} onClose={() => setEditingReservation(null)}>
          <DialogTitle>Editar Reserva</DialogTitle>
          <DialogContent>
            <TextField
              label="Nombre"
              name="name"
              value={editingReservation.name ?? ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Fecha"
              name="date"
              type="date"
              value={editingReservation.date ?? ''}
              onChange={handleEditChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Hora"
              name="time"
              type="time"
              value={editingReservation.time ?? ''}
              onChange={handleEditChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Comensales"
              name="guests"
              type="number"
              value={editingReservation.guests ?? ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mesa"
              name="table_id"
              type="number"
              value={editingReservation.table_id ?? ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingReservation(null)}>Cancelar</Button>
            <Button onClick={handleEditSave}>Guardar</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

export default ManageReservations;