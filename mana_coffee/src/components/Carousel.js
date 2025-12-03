import React from 'react';
import './Carousel.css';

function Carousel() {
  return (
    <div className="carousel">
      <h1 className="carousel-title">☕ Bienvenido a Mana Coffee</h1>
      <p className="carousel-subtitle">
        El mejor café de Ocaña, Norte de Santander
      </p>
      <button className="carousel-button">Ver Menú</button>
    </div>
  );
}

export default Carousel;