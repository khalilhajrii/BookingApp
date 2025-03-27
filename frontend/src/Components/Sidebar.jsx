import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import {
  MDBIcon,
} from 'mdb-react-ui-kit';

const Sidebar = ({ items }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      backgroundColor: '#2c2c2c',
      color: 'white',
      height: '100vh',
      width: '250px',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      {/* Logo or Title */}
      <div style={{ padding: '20px', borderBottom: '1px solid #404040' }}>
        <h4 className="text-white mb-0">Dashboard</h4>
      </div>

      {/* Menu Items */}
      <div style={{ flex: 1, padding: '20px 0' }}>
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            style={{
              padding: '15px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.3s',
            }}
            className="sidebar-item"
          >
            <MDBIcon icon={item.icon} className="me-3" />
            {item.label}
          </div>
        ))}
      </div>

      {/* Logout Section */}
      <div 
        onClick={handleLogout}
        style={{
          padding: '20px',
          borderTop: '1px solid #404040',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
        className="sidebar-logout"
      >
        <MDBIcon icon="sign-out-alt" className="me-3" />
        Logout
      </div>
    </div>
  );
};

export default Sidebar; 