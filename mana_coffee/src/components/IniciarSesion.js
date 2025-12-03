import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IniciarSesion.css';

function IniciarSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setCargando(true);

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }
localStorage.setItem('token', data.token);
localStorage.setItem('usuario', JSON.stringify(data.usuario));
alert(`¡Bienvenido ${data.usuario.nombre}!`);

// Recargar la página para actualizar el navbar
window.location.href = '/mi-cuenta';
} catch (err) {
setError(err.message);
} finally {
setCargando(false);
}
};

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Iniciar Sesión</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input 
              type="email" 
              placeholder="tu@email.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="login-footer">
            ¿No tienes cuenta? <span className="login-link" onClick={() => navigate('/registro')}>Regístrate</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default IniciarSesion;