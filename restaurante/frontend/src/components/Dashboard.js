// src/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { isEmployeeLoggedIn } = useAuth();
  if (!isEmployeeLoggedIn) {
    return <h2>Debes iniciar sesión como empleado para acceder a esta sección.</h2>;
  }
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