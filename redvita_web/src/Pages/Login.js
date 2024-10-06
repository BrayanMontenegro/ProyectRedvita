import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Importa correctamente tu configuración de Firebase
import '../styles/Login.css'; // Importamos el archivo CSS para los estilos

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Intentar iniciar sesión con Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home'); // Redirigir al home si el inicio de sesión es exitoso
    } catch (error) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="gradient-background">
      <div className="login-container">
        <h2 className="login-title">Iniciar Sesión</h2>

        {error && <p className="error-message">{error}</p>} {/* Mostrar errores */}

        <form onSubmit={handleLogin}>
          <div className="input-container">
            <label>Email</label>
            <input
              type="email"
              className="input"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <label>Contraseña</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </span>
            </div>
          </div>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
