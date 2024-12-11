import React, { useState } from 'react';
import axios from 'axios';

function EmployeeRegister() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  }); // Estado para manejar los datos del formulario
  const [error, setError] = useState(null); // Estado para manejar los errores

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/employees/', formData)
      .then(response => {
        alert('Employee registered successfully!');
        setFormData({
          username: '',
          password: '',
        }); // Restablecer los campos del formulario
      })
      .catch(error => {
        console.error('There was an error registering the employee!', error);
        setError('Hubo un error al registrar al empleado. Por favor, inténtalo de nuevo más tarde.');
      });
  };

  return (
    <div>
      <h2>Register Employee</h2>
      {error && <p className="error">{error}</p>} {/* Mostrar mensaje de error si existe */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default EmployeeRegister;