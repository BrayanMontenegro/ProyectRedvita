import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import logo from './logo.png'; // Reemplaza con la ruta correcta de tu logo
import { FaRightFromBracket } from 'react-icons/fa6';
import '../styles/Header.css';

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    console.log("Sesión cerrada");
    // Aquí puedes agregar la lógica para cerrar sesión
  };

  return (
    <div>
      {/* Navbar principal */}
      <Navbar className="custom-navbar" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="#home" className="navbar-brand">
            <img src={logo} alt="Logo" className="brand-logo" />
            <span className="brand-name">RedVita</span>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="custom-toggler"
            onClick={toggleMenu}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/home" className="nav-link-custom">HOME</Nav.Link>

              <NavDropdown title="EVENTOS" id="eventos" className="nav-link-custom nav-dropdown">
                <NavDropdown.Item as="div">
                  <Link to="/listnoti" className="link-unstyled">Ver Notificaciones</Link>
                </NavDropdown.Item>
                <NavDropdown.Item as="div">
                  <Link to="/Creanotifi" className="link-unstyled">Crear Notificacion</Link>
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="MÓDULO EDUCATIVO" id="servicios" className="nav-link-custom nav-dropdown">
                <NavDropdown.Item as="div">
                  <Link to="/EducationalModule" className="link-unstyled">Crear Módulo</Link>
                </NavDropdown.Item>
                <NavDropdown.Item as="div">
                  <Link to="/ListEducationalModules" className="link-unstyled">Lista de Módulos</Link>
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="DONANTES" id="donantes" className="nav-link-custom nav-dropdown">
                <NavDropdown.Item as="div">
                  <Link to="/useradmin" className="link-unstyled">usuarios</Link>
                </NavDropdown.Item>
                <NavDropdown.Item as="div">
                  <Link to="/donadores" className="link-unstyled">Lista de Donantes</Link>
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link as={Link} to="/login" className="nav-link-custom" onClick={cerrarSesion}>
                <FaRightFromBracket /> CERRAR SESIÓN
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Menú lateral (Offcanvas) */}
      <Offcanvas show={showMenu} onHide={toggleMenu} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/home" onClick={toggleMenu}>Home</Nav.Link>
            <Nav.Link as={Link} to="/donadores" onClick={toggleMenu}>Donantes</Nav.Link>
            <Nav.Link as={Link} to="/login" onClick={() => { cerrarSesion(); toggleMenu(); }}>
              <FaRightFromBracket /> Cerrar Sesión
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Header;
