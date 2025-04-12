import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
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
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        setIsLoggedIn(true);
        setUsername(decodedToken.username);
      } else {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUsername('');
      }
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  }, []);

  return (
    <Navbar 
      bg={isLoggedIn ? "light" : "dark"} 
      data-bs-theme={isLoggedIn ? "light" : "dark"} 
      className="navbar-fixed-top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">Barber.</Navbar.Brand>
        <Nav className="me-auto">
          {!isLoggedIn && (
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          )}
        </Nav>
        
        <Navbar.Collapse className="justify-content-end">
          {isLoggedIn ? (
            <Navbar.Text>
              Welcome, {username}
            </Navbar.Text>
          ) : (
            <Button 
              as={Link} 
              to="/register" 
              variant={isLoggedIn ? "outline-dark" : "outline-light"}
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