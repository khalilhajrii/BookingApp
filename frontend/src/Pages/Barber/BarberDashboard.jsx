import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar';

const BarberDashboard = () => {
  const sidebarItems = [
    {
      label: 'Manage Reservations',
      path: '/barber-dashboard',
      icon: 'user-tie'
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

export default BarberDashboard;