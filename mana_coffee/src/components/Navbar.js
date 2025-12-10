import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logoBlanco from '../assets/images/logo-blanco.png';

function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [brilloStyle, setBrilloStyle] = useState({});
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  // ✅ EFECTO PARA MOVER EL BRILLO AL LINK ACTIVO
  useEffect(() => {
    const updateBrilloPosition = () => {
      if (!navRef.current) return;

      // Obtener todos los links del navbar
      const links = navRef.current.querySelectorAll('.navbar-link');
      let activeLink = null;

      // Encontrar el link activo basándose en la ruta actual
      links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Comparación exacta de la ruta
        if (href === location.pathname) {
          activeLink = link;
        }
        
        // Para rutas que incluyen subrutas (ej: /arma-tu-almuerzo)
        if (location.pathname.startsWith(href) && href !== '/') {
          activeLink = link;
        }
      });

      if (activeLink) {
        const rect = activeLink.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        
        setBrilloStyle({
          left: `${rect.left - navRect.left}px`,
          width: `${rect.width}px`,
          opacity: 1
        });
      } else {
        setBrilloStyle({ opacity: 0 });
      }
    };

    updateBrilloPosition();
    window.addEventListener('resize', updateBrilloPosition);

    return () => window.removeEventListener('resize', updateBrilloPosition);
  }, [location.pathname, usuario]);

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
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <img src={logoBlanco} alt="Mana Coffee" className="navbar-logo-img" />
        </Link>
        
        {/* MENÚ DE NAVEGACIÓN */}
        <div className="navbar-menu" ref={navRef}>
          {/* ✅ BRILLO ANIMADO */}
          <div className="navbar-brillo" style={brilloStyle}></div>
          
          {!usuario ? (
            <>
              <Link to="/contactanos" className="navbar-link">¿QUIÉNES SOMOS?</Link>
              <Link to="/menu" className="navbar-link">MENÚ</Link>
              <Link to="/arma-tu-almuerzo" className="navbar-link">ARMA TU ALMUERZO</Link>
              <Link to="/iniciar-sesion" className="navbar-link">INICIAR SESIÓN</Link>
              <Link to="/registro" className="navbar-link navbar-link-registro">REGISTRARSE</Link>
            </>
          ) : (
            <>
              <Link to="/contactanos" className="navbar-link">¿QUIÉNES SOMOS?</Link>
              <Link to="/menu" className="navbar-link">MENÚ</Link>
              <Link to="/arma-tu-almuerzo" className="navbar-link">ARMA TU ALMUERZO</Link>
              <Link to="/reservar" className="navbar-link">RESERVAR</Link>
              
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
                      📋 Mis Reservas
                    </Link>
                    
                    {usuario.rol === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="navbar-usuario-menu-item navbar-admin-link"
                        onClick={() => setMenuAbierto(false)}
                      >
                        👑 Panel Admin
                      </Link>
                    )}
                    
                    <button 
                      className="navbar-usuario-menu-item navbar-cerrar-sesion"
                      onClick={cerrarSesion}
                    >
                      🚪 Cerrar Sesión
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