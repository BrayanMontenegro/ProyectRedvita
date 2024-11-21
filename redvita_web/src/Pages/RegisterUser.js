import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header";
import { Form, Button, Container, Alert } from "react-bootstrap";

const RegistrarAdmin = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleRegistrarAdmin = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Guardar los datos en Firestore
      await addDoc(collection(db, "admins"), {
        nombre,
        correo,
        password: hashedPassword, // Contraseña encriptada
        role: "admin",
        createdAt: new Date(),
      });

      setMensaje("Administrador registrado exitosamente.");
      setNombre("");
      setCorreo("");
      setPassword("");
    } catch (err) {
      console.error("Error al registrar el administrador:", err);
      setError("Ocurrió un error al registrar el administrador.");
    }
  };

  return (
    <Container className="mt-5">
        <Header></Header>
      <h2 className="text-center mb-4">---------</h2>
      <Form onSubmit={handleRegistrarAdmin} className="mt-4">
        {mensaje && <Alert variant="success">{mensaje}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formCorreo">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingrese el correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingrese la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Registrar Administrador
        </Button>
      </Form>
    </Container>
  );
};

export default RegistrarAdmin;
