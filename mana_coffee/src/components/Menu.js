import React from 'react';
import './Menu.css';

function Menu() {
  const menuItems = [
    { nombre: '☕ Café Americano', precio: '$5.000', descripcion: 'Café negro clásico' },
    { nombre: '🥤 Cappuccino', precio: '$6.000', descripcion: 'Con espuma de leche' },
    { nombre: '🍵 Latte', precio: '$6.500', descripcion: 'Suave y cremoso' },
    { nombre: '⚡ Espresso', precio: '$4.500', descripcion: 'Intenso y fuerte' },
    { nombre: '🧊 Frappé', precio: '$7.000', descripcion: 'Frío y refrescante' },
    { nombre: '🍰 Postres', precio: '$4.000', descripcion: 'Variedad de tortas' },
  ];

  return (
    <section className="menu">
      <h2 className="menu-title">Nuestro Menú</h2>
      <p className="menu-subtitle">Descubre nuestras deliciosas opciones</p>
      
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-card">
            <h3 className="menu-card-title">{item.nombre}</h3>
            <p className="menu-card-description">{item.descripcion}</p>
            <p className="menu-card-price">{item.precio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Menu;