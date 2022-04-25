import React from 'react';
import { useDispatch } from 'react-redux';
import Navbar  from 'react-bootstrap/Navbar';
import Nav  from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { clearToken } from '../store/auth/token'; 
import { useNavigate } from 'react-router-dom';


export default function Header() {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const logOut = function() {
    dispatch(clearToken({}));
    navigate("/");
  };

  return (
    <div>
      <Navbar expand="lg" background-color="#ffffff">
        
        <Container className="float-left">
          <Navbar.Brand href={'/'}><img src="/logo.png" alt="The Gospel Message Logo"></img></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <div className="float-right">
          <Navbar.Collapse id="basic-navbar-nav" className="float-right">
            <Nav className="float-right">
              <Nav.Link href={'/'}>Home</Nav.Link>
              <Nav.Link onClick={logOut}>Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}