import React from 'react';
import Header from '../components/Header';
import '../styles/Home.css'; // Archivo CSS personalizado para estilos adicionales

const Home = () => {
  return (
    <div className='home-container'>
      <Header />
      
      {/* Sección de bienvenida */}
      <div className="welcome-section p-5 text-center">
        <h1 className="display-4">¡Bienvenido a RedVita!</h1>
        <p className="lead">Tu plataforma de donación de sangre personalizada</p>
        <hr className="my-4" />
        <p>
          Aquí puedes obtener información sobre donaciones, recordatorios personalizados y mucho más.
          Ayudemos a salvar vidas.
        </p>
      </div>

      {/* Sección de información sobre donación */}
      <div className="row mt-5 info-section">
        <div className="col-md-6">
          <h2>¿Por qué donar sangre?</h2>
          <p>
            Donar sangre es un acto altruista que puede salvar la vida de muchas personas. En cada donación, se pueden salvar hasta tres vidas.
            Además, es un proceso rápido y seguro. Cada vez que donas, ayudas a mantener un suministro constante en los hospitales.
          </p>
        </div>
        <div className="col-md-6">
          <h2>¿Cómo funciona RedVita?</h2>
          <p>
            RedVita te envía recordatorios personalizados cuando es momento de donar nuevamente. Además, te informamos sobre campañas cercanas
            y te ofrecemos material educativo para que conozcas los beneficios de donar sangre regularmente.
          </p>
        </div>
      </div>

      {/* Sección de CTA (Call to Action) */}
      <div className="text-center mt-5 cta-section">
        <h3>¡Únete a nuestra comunidad y ayuda a salvar vidas!</h3>
        <button className="btn btn-primary btn-lg mt-3">Regístrate Ahora</button>
      </div>
    </div>
  );
};

export default Home;
