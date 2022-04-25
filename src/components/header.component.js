import React from 'react';
import { Link } from 'react-router-dom';
import Navbar  from 'react-bootstrap/Navbar';
import Nav  from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';


export default function Header() {
  return (
    <div>
    <Navbar expand="lg" background-color="#ffffff">
      <Container>
        <Navbar.Brand href={'/'}><img src="/logo.png" alt="The Gospel Message Logo"></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="d-flex">
            <Nav.Link href={'/'}>Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  );
}