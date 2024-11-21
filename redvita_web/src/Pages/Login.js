import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const LoginAdmin = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      //? Consultar Firestore para encontrar al administrador
      const q = query(collection(db, "admins"), where("correo", "==", correo));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Correo no encontrado o no autorizado.");
        return;
      }

      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();

      //? Comparar la contraseña encriptada
      const isValidPassword = await bcrypt.compare(password, adminData.password);

      if (isValidPassword) {
        navigate("/Home");
      } else {
        setError("Contraseña incorrecta.");
      }
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err);
      setError("Ocurrió un error al intentar iniciar sesión.");
    }
  };

  return (
    <div className="login-background">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="p-4 shadow-lg login-card">
          <Card.Body>
            <h2 className="text-center mb-4">Inicio de Sesión</h2>
            <Form onSubmit={handleLogin}>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group className="mb-3" controlId="formCorreo">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese su correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100">
                Iniciar Sesión
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LoginAdmin;
