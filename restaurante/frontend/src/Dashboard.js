// Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleCreateDish = () => {
    navigate('/create-dish');
  };

  const handleViewManageReservations = () => {
    navigate('/manage-reservations');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleCreateDish}>Crear Plato</button>
      <button onClick={handleViewManageReservations}>Ver Reservas</button>
    </div>
  );
}

export default Dashboard;