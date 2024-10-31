// src/EmployeeSection.js
import React from 'react';
import { Link } from 'react-router-dom';

function EmployeeSection() {
  return (
    <div>
      <h2>Sección de Empleados</h2>
      <ul>
        <li><Link to="/employee-login">Login de Empleados</Link></li>
        <li><Link to="/employee-register">Crear Empleado</Link></li>
      </ul>
    </div>
  );
}

export default EmployeeSection;