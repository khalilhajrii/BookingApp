import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar';
import BarberList from '../../Components/BarberList';

const UserDashboard = () => {
  const sidebarItems = [
    {
      label: 'Available Barbers',
      path: '/user-dashboard',
      icon: 'user-tie'
    },
    {
      label: 'Take Reservation',
      path: '/user-dashboard/take-reservation',
      icon: 'calendar-plus'
    },
    {
      label: 'My Reservations',
      path: '/user-dashboard/my-reservations',
      icon: 'calendar-check'
    }
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar items={sidebarItems} />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboard;