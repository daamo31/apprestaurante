import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Menu from './Menu';
import EmployeeSection from './EmployeeSection';
import UserAccess from './UserAccess';
import EmployeeLogin from './EmployeeLogin';
import EmployeeRegister from './EmployeeRegister';
import ManageReservations from './ManageReservations';
import CreateDish from './CreateDish';
import Reservations from './Reservations';
import Dishes from './Dishes';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import ManageUsers from './ManageUsers'; // Importar el componente ManageUsers

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menú</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/" element={
            <>
              <h1>Bienvenido a nuestro Restaurante</h1>
              <Dishes />
              <Link to="/reservations">Hacer Reserva</Link>
            </>
          } />
          <Route path="/menu" element={<Menu />} />
          <Route path="/dishes" element={<Dishes />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/employee-section" element={<EmployeeSection />} />
          <Route path="/user-access" element={<UserAccess />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/employee-register" element={<EmployeeRegister />} />
          <Route path="/user-access" element={<UserAccess />} />
          <Route path="/create-dish" element={<CreateDish />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/manage-reservations" element={<ManageReservations />} />
          <Route path="/manage-users" element={<ManageUsers />} /> {/* Añadir ruta para ManageUsers */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;