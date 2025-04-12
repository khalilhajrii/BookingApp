import React, { useState, useEffect } from 'react';
import { Badge, Dropdown } from 'react-bootstrap';
import io from 'socket.io-client';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      // Connect to Socket.IO
      const newSocket = io('http://localhost:3000', {
        auth: { token }
      });
  
      setSocket(newSocket);
  
      // Listen for notifications
      newSocket.on('new_booking_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
      });
  
      // Cleanup
      return () => newSocket.disconnect();
    }, []);
  
    // Fetch existing notifications
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/notifications/getNotification', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          setNotifications(data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
  
      fetchNotifications();
    }, []);
  
    return (
      <Dropdown align="end">
        <Dropdown.Toggle variant="light" id="dropdown-notifications">
          <i className="fas fa-bell"></i>
          {notifications.length > 0 && (
            <Badge pill bg="danger" className="position-absolute translate-middle">
              {notifications.length}
            </Badge>
          )}
        </Dropdown.Toggle>
  
        <Dropdown.Menu className="dropdown-menu-end" style={{ minWidth: '300px' }}>
          {notifications.length === 0 ? (
            <Dropdown.Item>No notifications</Dropdown.Item>
          ) : (
            notifications.map(notification => (
              <Dropdown.Item 
                key={notification._id} 
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
                  <div>{notification.message}</div>
                </div>
                {!notification.read && <span className="badge bg-primary">New</span>}
              </Dropdown.Item>
            ))
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  };
  
  export default NotificationBell;