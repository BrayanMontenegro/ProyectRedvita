import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de que la ruta sea correcta
import Header from '../components/Header';

const VerCitas = () => {
  const [citas, setCitas] = useState([]);

  // Función para obtener las citas de Firestore
  const fetchCitas = async () => {
    try {
      const citasCollection = collection(db, 'citas');
      const citasSnapshot = await getDocs(citasCollection);
      const citasList = citasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCitas(citasList);
      console.log(citasList);
    } catch (error) {
      console.error('Error obteniendo las citas: ', error);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  return (
    <div className="container mt-5">
      <Header />
      <h2>Lista de Citas</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{cita.nombre}</td>
              <td>{new Date(cita.fecha.seconds * 1000).toLocaleDateString()}</td>
              <td>{cita.hora}</td>
              <td>{cita.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerCitas;
