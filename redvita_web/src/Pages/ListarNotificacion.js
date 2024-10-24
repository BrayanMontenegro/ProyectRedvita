import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de que la ruta sea correcta
import Header from '../components/Header';

const VerNotificacion = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentNotificacion, setCurrentNotificacion] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Función para obtener las notificaciones de Firestore
  const fetchNotificaciones = async () => {
    try {
      const notificacionesCollection = collection(db, 'notificaciones');
      const notificacionesSnapshot = await getDocs(notificacionesCollection);
      const notificacionesList = notificacionesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotificaciones(notificacionesList);
    } catch (error) {
      console.error('Error obteniendo las notificaciones: ', error);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  // Función para eliminar una notificación
  const handleEliminar = async (id) => {
    try {
      await deleteDoc(doc(db, 'notificaciones', id));
      alert('Notificación eliminada exitosamente');
      fetchNotificaciones(); // Actualiza la lista de notificaciones
    } catch (error) {
      console.error('Error eliminando la notificación: ', error);
    }
  };

  // Función para habilitar el modo de edición
  const handleEditar = (notificacion) => {
    setEditMode(true);
    setCurrentNotificacion(notificacion);
    setTitulo(notificacion.titulo);
    setMensaje(notificacion.mensaje);
  };

  // Función para actualizar una notificación
  const handleActualizar = async (e) => {
    e.preventDefault();
    try {
      const notificacionRef = doc(db, 'notificaciones', currentNotificacion.id);
      await updateDoc(notificacionRef, {
        titulo,
        mensaje,
        timestamp: new Date(),
      });
      alert('Notificación actualizada exitosamente');
      setEditMode(false);
      setCurrentNotificacion(null);
      setTitulo('');
      setMensaje('');
      fetchNotificaciones(); // Actualiza la lista de notificaciones
    } catch (error) {
      console.error('Error actualizando la notificación: ', error);
    }
  };

  return (
    <div className="container mt-5">
      <Header />
      <h2>{editMode ? 'Editar Notificación' : 'Lista de Notificaciones'}</h2>

      {editMode ? (
        <form onSubmit={handleActualizar}>
          <div className="mb-3">
            <label htmlFor="titulo" className="form-label">Título</label>
            <input
              type="text"
              className="form-control"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="mensaje" className="form-label">Mensaje</label>
            <textarea
              className="form-control"
              id="mensaje"
              rows="3"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Actualizar Notificación</button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setEditMode(false)}
          >
            Cancelar
          </button>
        </form>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Título</th>
              <th>Mensaje</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {notificaciones.map((notificacion) => (
              <tr key={notificacion.id}>
                <td>{notificacion.titulo}</td>
                <td>{notificacion.mensaje}</td>
                <td>{new Date(notificacion.timestamp.seconds * 1000).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditar(notificacion)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(notificacion.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerNotificacion;
