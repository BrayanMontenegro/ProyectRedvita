import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header";
import { Table, Button, Container, Badge, Modal, Form } from "react-bootstrap";

const GestionCitas = () => {
  const [citas, setCitas] = useState([]);
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCita, setSelectedCita] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [centroDonacion, setCentroDonacion] = useState("");

  // Obtener las citas desde Firestore
  const fetchCitas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "citas_donacion"));
      const citasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCitas(citasData);
    } catch (error) {
      console.error("Error al obtener las citas:", error);
    }
  };

  // Obtener los centros de donación desde Firestore
  const fetchCentros = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "centros_donacion"));
      const centrosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCentros(centrosData);
    } catch (error) {
      console.error("Error al obtener los centros de donación:", error);
    }
  };

  // Mostrar el modal y cargar la cita seleccionada
  const handleOpenModal = (cita) => {
    setSelectedCita(cita);
    setNuevoEstado(cita.estado);
    setCentroDonacion(cita.centroDonacion || "");
    setShowModal(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCita(null);
  };

  // Guardar cambios en Firestore
  const handleSaveChanges = async () => {
    try {
      const citaRef = doc(db, "citas_donacion", selectedCita.id);
      await updateDoc(citaRef, {
        estado: nuevoEstado,
        centroDonacion,
      });

      // Actualizar el estado local
      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.id === selectedCita.id
            ? { ...cita, estado: nuevoEstado, centroDonacion }
            : cita
        )
      );

      alert("Los cambios se han guardado correctamente.");
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  // Cargar las citas y los centros al cargar el componente
  useEffect(() => {
    fetchCitas();
    fetchCentros();
    setLoading(false);
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <Container className="mt-5">
      <Header />
      <h2 className="text-center mt-4">Gestión de Citas de Donación</h2>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita, index) => (
            <tr key={cita.id}>
              <td>{index + 1}</td>
              <td>{cita.nombresDonante} {cita.apellidoDonante}</td>
              <td>{cita.correoDonante}</td>
              <td>
                <Badge
                  bg={
                    cita.estado === "pendiente"
                      ? "warning"
                      : cita.estado === "aceptado"
                      ? "success"
                      : "danger"
                  }
                >
                  {cita.estado}
                </Badge>
              </td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => handleOpenModal(cita)}
                >
                  Gestionar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para editar estado y centro */}
      {selectedCita && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Gestionar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Centro de Donación</Form.Label>
                <Form.Select
                  value={centroDonacion}
                  onChange={(e) => setCentroDonacion(e.target.value)}
                >
                  <option value="">Seleccione un centro</option>
                  {centros.map((centro) => (
                    <option key={centro.id} value={centro.nombre}>
                      {centro.nombre} - {centro.ubicacion}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="aceptado">Aceptado</option>
                  <option value="denegado">Denegado</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="success" onClick={handleSaveChanges}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default GestionCitas;
