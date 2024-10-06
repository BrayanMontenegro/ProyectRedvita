import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de que la ruta sea correcta
import Header from '../components/Header';

const CrearNotificacion = () => {
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Función para agregar una nueva notificación a Firestore
  const handleAgregarNotificacion = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'notificaciones'), {
        titulo,
        mensaje,
        timestamp: new Date(),
      });
      alert('Notificación creada exitosamente');
      setTitulo('');
      setMensaje('');
    } catch (error) {
      console.error('Error creando la notificación: ', error);
    }
  };

  return (
    <div className="container mt-5">
      <Header />
      <h2>Crear Notificación</h2>
      <form onSubmit={handleAgregarNotificacion}>
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
        <button type="submit" className="btn btn-primary">Crear Notificación</button>
      </form>
    </div>
  );
};

export default CrearNotificacion;
