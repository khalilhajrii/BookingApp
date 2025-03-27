import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import UserDashboard from './Pages/User/UserDashboard';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import HomePage from './Pages/HomePage';
import RegistrationSuccess from './Pages/RegistrationSuccess';
import AccountActivation from './Pages/AccountActivation';
import TakeReservation from './Pages/User/TakeReservation';
import MyReservations from './Pages/User/MyReservations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/activate/:token" element={<AccountActivation />} />
        
        <Route 
          path="/user-dashboard" 
          element={
            <PrivateRoute allowedRoles={['user']}>
              <UserDashboard />
            </PrivateRoute>
          } 
        >
          <Route path="take-reservation" element={<TakeReservation />} />
          <Route path="my-reservations" element={<MyReservations />} />
        </Route>

        <Route 
          path="/admin-dashboard" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
