import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Dropdown, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);

      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        setIsLoggedIn(true);
        setUsername(decodedToken.username);

        const newSocket = io('http://localhost:8000', {
          auth: {
            token: `Bearer ${token}`
          }
        });
        setSocket(newSocket);

        newSocket.on('new_booking_notification', (newNotification) => {
          setNotifications(prev => [
            {
              ...newNotification,
              createdAt: new Date(newNotification.createdAt),
              _id: newNotification._id || Date.now().toString() // Fallback ID
            },
            ...prev
          ]);
        });

        newSocket.on('status_booking_notification', (newNotification) => {
          setNotifications(prev => [
            {
              ...newNotification,
              createdAt: new Date(newNotification.createdAt),
              _id: newNotification._id || Date.now().toString() // Fallback ID
            },
            ...prev
          ]);
        });

        newSocket.on('connect_error', (err) => {
          console.error('Connection error:', err.message);
        });
        return () => newSocket.disconnect();
      }
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/notifications/getNotification', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [isLoggedIn]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/notifications/updateNotificationStatus/${notificationId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update notification status');
      }

      // Update the notifications state
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  return (
    <Navbar
      bg={isLoggedIn ? "light" : "dark"}
      data-bs-theme={isLoggedIn ? "light" : "dark"}
      className="navbar-fixed-top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">Barber.</Navbar.Brand>

        <Navbar.Collapse className="justify-content-end">
          {isLoggedIn ? (
            <div className="d-flex align-items-center gap-3">
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-notifications">
                  <i className="fas fa-bell"></i>
                  {notifications.length > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute translate-middle"
                      style={{ top: '0.5rem', right: '0.5rem' }}
                    >
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
                        className="d-flex justify-content-between align-items-start"
                      >
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{notification.message}</div>
                          <small className="text-muted">
                            {new Date(notification.createdAt).toLocaleString()}
                          </small>
                        </div>
                        {!notification.read && (
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary">New</span>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => markAsRead(notification._id)}
                            >
                              ✓
                            </Button>
                          </div>
                        )}
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              </Dropdown>

              <Navbar.Text>
                Welcome, {username}
              </Navbar.Text>

            </div>
          ) : (
            <Button
              as={Link}
              to="/register"
              variant="outline-light"
            >
              Login / Sign In
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;