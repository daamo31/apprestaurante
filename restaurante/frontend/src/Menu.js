// src/Menu.js
import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div>
      <h2>Menu</h2>
      <ul>
        <li><Link to="/employee-section">Sección de Empleados</Link></li>
        <li><Link to="/user-access">Sección de Acceso a Usuarios</Link></li>
      </ul>
    </div>
  );
}

export default Menu;