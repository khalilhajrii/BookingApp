import React from 'react';
import Sidebar from '../../Components/Sidebar';
import { Outlet } from 'react-router-dom';
const AdminDashboard = () => {
  const sidebarItems = [
    {
      label: 'Manage Users',
      path: '/admin-dashboard',
      icon: 'calendar-alt'
    },
    {
      label: 'Manage Roles',
      path: 'roles',
      icon: 'list'
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

export default AdminDashboard;