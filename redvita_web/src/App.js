import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Donadores from './Pages/donantes'; // Asegúrate de que la ruta sea correcta
import Home from './Pages/Home'; // Otros componentes
import Login from './Pages/Login';
import EducationalModule from './Pages/modulos';
import ListEducationalModules from './Pages/listarmodulos';

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/donadores" element={<Donadores />} />
        <Route path="/ListEducationalModules" element={<ListEducationalModules />} />
        <Route path="/EducationalModule" element={<EducationalModule />} />
        <Route path="/" element={<Login />} /> {/* Redirigir por defecto al login */}
      </Routes>
    </Router>
  );
}

export default App;
