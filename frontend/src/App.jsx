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
import BarberList from './Components/BarberList';
import EditBooking from './Components/EditBooking';
import BarberDashboard from './Pages/Barber/BarberDashboard';
import BarberReservations from './Pages/Barber/BarberReservations';
import UserManagement from './Pages/Admin/UserManagement';
import AddUser from './Pages/Admin/AddUser';
import UpdateUser from './Pages/Admin/UpdateUser';
import RoleManagement from './Pages/Admin/RoleManagement';
import EditRole from './Pages/Admin/EditRole';
import AddRole from './Pages/Admin/AddRole';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/activate/:token" element={<AccountActivation />} />
        <Route path="/" element={<HomePage />} />

        <Route path="/user-dashboard" element={
          <PrivateRoute allowedRoles={['user']}>
            <UserDashboard />
          </PrivateRoute>
        }>
          <Route index element={<BarberList />} />
          <Route path="take-reservation/:barberid" element={<TakeReservation />} />
          <Route path="my-reservations" element={<MyReservations />} />
          <Route path="edit-booking/:id" element={<EditBooking />} />
        </Route>

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<UserManagement />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="update-user/:id" element={<UpdateUser />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="roles/add" element={<AddRole />} />
          <Route path="roles/edit/:id" element={<EditRole />} />
        </Route>

        <Route
          path="/barber-dashboard"
          element={
            <PrivateRoute allowedRoles={['barber']}>
              <BarberDashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<BarberReservations />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
