import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate de que la ruta sea correcta
import Header from '../components/Header';

const Donadores = () => {
  const [donadores, setDonadores] = useState([]);

  // Función para obtener los donadores de Firestore
  const fetchDonadores = async () => {
    try {
      const donadoresCollection = collection(db, 'usuario_donante'); // db debe ser el primer argumento
      const donadoresSnapshot = await getDocs(donadoresCollection);
      const donadoresList = donadoresSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDonadores(donadoresList);
      console.log(donadoresList);
    } catch (error) {
      console.error('Error fetching documents: ', error);
    }
  };

  useEffect(() => {
    fetchDonadores();
  }, []);

  return (
    <div className="container mt-5">
        <Header/>
      <h2>Lista de Donadores</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Tipo de Sangre</th>
          </tr>
        </thead>
        <tbody>
          {donadores.map((donador) => (
            <tr key={donador.id}>
              <td>{donador.nombres}</td>
              <td>{donador.apellidos}</td>
              <td>{donador.correoElectronico}</td>
              <td>{donador.telefono}</td>
              <td>{donador.tipoSangre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Donadores;
