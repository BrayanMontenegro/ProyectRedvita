import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { MapContainer, TileLayer, Marker, useMap, useMapEvent } from 'react-leaflet';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';

const ListarCentros = () => {
  const [centros, setCentros] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState({ lat: -34.6037, lng: -58.3816 });
  const [showModal, setShowModal] = useState(false);
  const [currentCentro, setCurrentCentro] = useState(null);

  const fetchCentros = async () => {
    const querySnapshot = await getDocs(collection(db, 'centros_donacion'));
    const centrosList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCentros(centrosList);
  };

  useEffect(() => {
    fetchCentros();
  }, []);

  const handleEliminar = async (id) => {
    try {
      await deleteDoc(doc(db, 'centros_donacion', id));
      alert('Centro eliminado exitosamente');
      fetchCentros();
    } catch (error) {
      console.error('Error al eliminar el centro:', error);
    }
  };

  const handleUbicar = (lat, lng) => {
    setSelectedCoords({ lat, lng });
  };

  const handleEditar = (centro) => {
    setCurrentCentro(centro);
    setShowModal(true);
  };

  const handleGuardarCambios = async () => {
    try {
      await updateDoc(doc(db, 'centros_donacion', currentCentro.id), {
        nombre: currentCentro.nombre,
        ubicacion: currentCentro.ubicacion,
      });
      alert('Centro actualizado exitosamente');
      setShowModal(false);
      fetchCentros();
    } catch (error) {
      console.error('Error al actualizar el centro:', error);
    }
  };

  const MapRef = () => {
    const map = useMap();
    map.setView(selectedCoords, 14); // Actualiza la vista del mapa
    return null;
  };

  return (
    <div className="container mt-5">
        <Header/>
      <h2>Lista de Centros de Donación</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {centros.map((centro) => (
            <tr key={centro.id}>
              <td>{centro.nombre}</td>
              <td>{centro.ubicacion}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleUbicar(centro.latitud, centro.longitud)}
                >
                  Ubicar
                </button>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEditar(centro)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleEliminar(centro.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-5">Mapa</h3>
      <MapContainer center={selectedCoords} zoom={14} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapRef />
        <Marker position={selectedCoords} />
      </MapContainer>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Centro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Centro</Form.Label>
              <Form.Control
                type="text"
                value={currentCentro?.nombre || ''}
                onChange={(e) =>
                  setCurrentCentro({ ...currentCentro, nombre: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                value={currentCentro?.ubicacion || ''}
                onChange={(e) =>
                  setCurrentCentro({ ...currentCentro, ubicacion: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarCambios}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListarCentros;
