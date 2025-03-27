import React from 'react';
import Sidebar from '../../Components/Sidebar';

const AdminDashboard = () => {
  const sidebarItems = [
    {
      label: 'Manage Reservations',
      path: '/admin-dashboard/manage-reservations',
      icon: 'calendar-alt'
    },
    {
      label: 'All Reservations',
      path: '/admin-dashboard/all-reservations',
      icon: 'list'
    }
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar items={sidebarItems} />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <h2>Welcome to Admin Dashboard</h2>
        {/* Your dashboard content goes here */}
      </div>
    </div>
  );
};

export default AdminDashboard;