import React from 'react';
import { Link } from 'react-router-dom';
import Navbar  from 'react-bootstrap/Navbar';
import Nav  from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';


export default function Header() {
  return (
    <div>
    <Navbar expand="lg" background-color="#ffffff">
      
      <Container className="float-left">
        <Navbar.Brand href={'/'}><img src="/logo.png" alt="The Gospel Message Logo"></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <div class="float-right">
        <Navbar.Collapse id="basic-navbar-nav" className="float-right">
          <Nav className="float-right">
            <Nav.Link href={'/'}>Home</Nav.Link>
            <Nav.Link href={'/'}>Log Out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
    </div>
  );
}