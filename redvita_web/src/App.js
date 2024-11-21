import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Donadores from './Pages/donantes'; // Asegúrate de que la ruta sea correcta
import Home from './Pages/Home'; // Otros componentes
import Login from './Pages/Login';
import EducationalModule from './Pages/modulos';
import ListEducationalModules from './Pages/listarmodulos';
import CrearNotificacion from './Pages/Notificacion';
import VerNotificacion from './Pages/ListarNotificacion';
import RegisterCenter from './Pages/RegisterCenter';
import ListarCentros from './Pages/ListarCenter';
import VerCitas from './Pages/ListarCita';
import RegistrarAdmin from './Pages/RegisterUser';
function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Creanotifi" element={<CrearNotificacion />} />
        <Route path="/Citas" element={<VerCitas />} />
        <Route path="/Createcerter" element={<RegisterCenter />} />
        <Route path="/useradmin" element={<RegistrarAdmin />} />
        <Route path="/ListarCen" element={<ListarCentros />} />
        <Route path="/donadores" element={<Donadores />} />
        <Route path="/listnoti" element={<VerNotificacion />} />
        <Route path="/ListEducationalModules" element={<ListEducationalModules />} />
        <Route path="/EducationalModule" element={<EducationalModule />} />
        <Route path="/" element={<Login />} /> {/* Redirigir por defecto al login */}
      </Routes>
    </Router>
  );
}

export default App;
