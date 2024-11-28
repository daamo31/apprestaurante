// src/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { isEmployeeLoggedIn } = useAuth();

  const handleCreateDish = () => {
    navigate('/create-dish');
  };

  const handleViewManageReservations = () => {
    navigate('/manage-reservations');
  };

  const handleViewDishes = () => {
    navigate('/dishes');
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleCreateDish}>Crear Plato</button>
      <button onClick={handleViewManageReservations}>Ver Reservas</button>
      <button onClick={handleViewDishes}>Ver Platos</button>
    </div>
  );
}

export default Dashboard;