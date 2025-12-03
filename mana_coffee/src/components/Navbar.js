import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay usuario logueado
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setMenuAbierto(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ☕ Mana Coffee
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Inicio</Link>
          <Link to="/arma-tu-almuerzo" className="navbar-link">Arma Tu Almuerzo</Link>
          <Link to="/contactanos" className="navbar-link">Contáctanos</Link>
          
          {/* Si NO hay usuario logueado */}
          {!usuario ? (
            <>
              <Link to="/iniciar-sesion" className="navbar-link">Iniciar Sesión</Link>
              <Link to="/registro" className="navbar-link navbar-link-registro">Registrarse</Link>
            </>
          ) : (
            /* Si HAY usuario logueado */
            <>
              <Link to="/reservar" className="navbar-link">Reservar</Link>
              
              {/* Menú desplegable del usuario */}
              <div className="navbar-usuario">
                <button 
                  className="navbar-usuario-btn"
                  onClick={() => setMenuAbierto(!menuAbierto)}
                >
                  <span className="navbar-usuario-icono">👤</span>
                  <span className="navbar-usuario-nombre">{usuario.nombre}</span>
                  <span className="navbar-usuario-flecha">{menuAbierto ? '▲' : '▼'}</span>
                </button>
                
                {menuAbierto && (
                  <div className="navbar-usuario-menu">
                    <Link 
                      to="/mi-cuenta" 
                      className="navbar-usuario-menu-item"
                      onClick={() => setMenuAbierto(false)}
                    >
                      <span>📋</span> Mis Reservas
                    </Link>
                    <Link 
                      to="/mi-perfil" 
                      className="navbar-usuario-menu-item"
                      onClick={() => setMenuAbierto(false)}
                    >
                      <span>⚙️</span> Mi Perfil
                    </Link>
                    <button 
                      className="navbar-usuario-menu-item navbar-cerrar-sesion"
                      onClick={cerrarSesion}
                    >
                      <span>🚪</span> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;