import React from 'react';
import './ArmaTuAlmuerzo.css';

function ArmaTuAlmuerzo() {
  const opciones = [
    { categoria: ' Base', items: ['Pan integral', 'Pan blanco', 'Croissant', 'Bagel'] },
    { categoria: ' Proteína', items: ['Pollo', 'Jamón', 'Atún', 'Queso'] },
    { categoria: ' Vegetales', items: ['Lechuga', 'Tomate', 'Cebolla', 'Aguacate'] },
    { categoria: ' Extra', items: ['Salsa', 'Mayonesa', 'Mostaza', 'Ají'] },
  ];

  return (
    <section className="arma-tu-almuerzo">
      <h2 className="arma-title">Arma Tu Almuerzo</h2>
      <p className="arma-subtitle">Coma comida saludable</p>

      <div className="arma-grid">
        {opciones.map((opcion, index) => (
          <div key={index} className="arma-card">
            <h3 className="arma-card-title">{opcion.categoria}</h3>
            <ul className="arma-list">
              {opcion.items.map((item, i) => (
                <li key={i} className="arma-list-item">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="arma-button-container">
        <button className="arma-button">Ordenar Ahora</button>
      </div>
    </section>
  );
}

export default ArmaTuAlmuerzo;