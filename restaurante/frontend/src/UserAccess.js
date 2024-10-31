// src/UserAccess.js
import React from 'react';
import { Link } from 'react-router-dom';

function UserAccess() {
  return (
    <div>
      <h2>Sección de Acceso a Usuarios</h2>
      <ul>
        <li><Link to="/user-login">Login de Usuarios</Link></li>
        <li><Link to="/user-register">Crear Usuario</Link></li>
      </ul>
    </div>
  );
}

export default UserAccess;