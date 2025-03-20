import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

const NavBar = () => {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Barber</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Button variant="outline-light">Login / Sign In</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
};

export default NavBar;