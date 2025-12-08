import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logoMana from '../assets/logo-mana.png';

function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Para saber en qué ruta estamos

  useEffect(() => {
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

  // Función para verificar si la ruta está activa
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar-mana">
      <div className="navbar-container-mana">
        
        {/* LOGO */}
        <Link to="/" className="navbar-logo-mana">
          <img src={logoMana} alt="Mana Coffee Logo" className="logo-image-mana" />
        </Link>
        
        {/* MENÚ DE NAVEGACIÓN */}
        <div className="navbar-menu-mana">
          
          {/* ¿QUIENES SOMOS? */}
          <Link 
            to="/contactanos" 
            className={`navbar-link-mana ${isActive('/contactanos') ? 'active' : ''}`}
          >
            ¿QUIENES SOMOS?
          </Link>

          {/* MENÚ */}
          <Link 
            to="/menu" 
            className={`navbar-link-mana ${isActive('/menu') ? 'active' : ''}`}
          >
            MENÚ
          </Link>

          {/* ARMA TU ALMUERZO */}
          <Link 
            to="/arma-tu-almuerzo" 
            className={`navbar-link-mana ${isActive('/arma-tu-almuerzo') ? 'active' : ''}`}
          >
            ARMA TU ALMUERZO
          </Link>

          {/* INICIAR SESIÓN / USUARIO */}
          {!usuario ? (
            <Link 
              to="/iniciar-sesion" 
              className={`navbar-link-mana ${isActive('/iniciar-sesion') ? 'active' : ''}`}
            >
              INICIAR SESIÓN
            </Link>
          ) : (
            /* Menú desplegable del usuario */
            <div className="navbar-usuario-mana">
              <button 
                className="navbar-usuario-btn-mana"
                onClick={() => setMenuAbierto(!menuAbierto)}
              >
                <span className="usuario-icono">👤</span>
                <span className="usuario-nombre">{usuario.nombre}</span>
                <span className="usuario-flecha">{menuAbierto ? '▲' : '▼'}</span>
              </button>
              
              {menuAbierto && (
                <div className="navbar-usuario-menu-mana">
                  <Link 
                    to="/mi-cuenta" 
                    className="menu-item"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <span>📋</span> Mis Reservas
                  </Link>
                  
                  {usuario.rol === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="menu-item admin-link"
                      onClick={() => setMenuAbierto(false)}
                    >
                      <span>👑</span> Panel Admin
                    </Link>
                  )}
                  
                  <button 
                    className="menu-item cerrar-sesion"
                    onClick={cerrarSesion}
                  >
                    <span>🚪</span> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}

          {/* REGISTRARSE */}
          {!usuario && (
            <Link 
              to="/registro" 
              className={`navbar-link-mana registrarse-btn ${isActive('/registro') ? 'active' : ''}`}
            >
              REGISTRARSE
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;