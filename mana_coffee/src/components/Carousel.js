import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Carousel.css';

function Carousel() {
  const navigate = useNavigate();

  const irAlMenu = () => {
    navigate('/menu');
  };

  return (
    <div className="carousel">
      <h1 className="carousel-title">☕ Bienvenido a Mana Coffee</h1>
      <p className="carousel-subtitle">
        El sabor de la compañía es insuperable
      </p>
      <button className="carousel-button" onClick={irAlMenu}>
        Ver Menú
      </button>
    </div>
  );
}

export default Carousel;