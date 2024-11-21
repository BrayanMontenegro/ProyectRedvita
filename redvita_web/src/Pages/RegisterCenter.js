import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Header from '../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/CrearCentro.css'


const center = {
  lat: 12.100558244079561, 
  lng: -85.36304855333583,
};

const CrearCentro = () => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [coords, setCoords] = useState(center);

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        setCoords({
          lat: event.latlng.lat,
          lng: event.latlng.lng,
        });
      },
    });
    return null;
  };

  const handleAgregarCentro = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'centros_donacion'), {
        nombre,
        ubicacion,
        latitud: coords.lat,
        longitud: coords.lng,
        timestamp: new Date(),
      });
      alert('Centro de donación registrado exitosamente');
      setNombre('');
      setUbicacion('');
      setCoords(center);
    } catch (error) {
      console.error('Error creando el centro: ', error);
    }
  };

  return (
    <div className="container-form">
      <div className='container-heder'>
      <Header />
      </div>
      <div className="form-card">
        <h2>Registrar Centro de Donación</h2>
        <form onSubmit={handleAgregarCentro}>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del Centro"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="Ubicación"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
          <div className="form-control" readOnly>
            {`Latitud: ${coords.lat}, Longitud: ${coords.lng}`}
          </div>

          <div className="map-container">
            <MapContainer
              center={center}
              zoom={14}
              style={{ height: '300px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <MapClickHandler />
              <Marker position={coords} />
            </MapContainer>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Registrar Centro
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearCentro;
