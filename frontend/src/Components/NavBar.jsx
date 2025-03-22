import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <Navbar bg="dark" data-bs-theme="dark" className='navbar-fixed-top'>
        <Container>
          <Navbar.Brand as={Link} to="/">Barber</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Button as={Link} to="/register" variant="outline-light">Login / Sign In</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
};

export default NavBar;