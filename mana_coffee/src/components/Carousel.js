import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Carousel.css';
import localExterior from '../assets/images/local-exterior.png';
import logoDorado from '../assets/images/logo-dorado.png';

function Carousel() {
  const navigate = useNavigate();

  const irAlMenu = () => {
    navigate('/menu');
  };

  return (
    <div className="hero-section">
      {/* LADO IZQUIERDO - IMAGEN */}
      <div className="hero-left">
        <img src={localExterior} alt="Mana Coffee Local" className="hero-imagen" />
      </div>

      {/* LADO DERECHO - CONTENIDO */}
      <div className="hero-right">
        <div className="hero-content">
          <h2 className="hero-bienvenido">BIENVENIDO A</h2>
          
          {/* ✅ CONTENEDOR DEL LOGO CON BRILLITOS CSS */}
          <div className="hero-logo-container">
            {/* Brillitos creados con CSS - NO son imágenes */}
            <div className="brillito brillito-1"></div>
            <div className="brillito brillito-2"></div>
            
            {/* LOGO PRINCIPAL */}
            <img src={logoDorado} alt="Mana" className="hero-logo-grande" />
            
            {/* Más brillitos CSS */}
            <div className="brillito brillito-3"></div>
            <div className="brillito brillito-4"></div>
          </div>
          
          <p className="hero-restobar">RESTOBAR</p>
          
          <p className="hero-subtitle">
            El sabor de la compañía es insuperable
          </p>
          
          <button className="hero-button" onClick={irAlMenu}>
            Ver Menú
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carousel;