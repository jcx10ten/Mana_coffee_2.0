import React, { useState } from 'react';
import './Menu.css';

function Menu() {
  const [categoriaAbierta, setCategoriaAbierta] = useState(null);

  // Toggle para abrir/cerrar categorías
  const toggleCategoria = (categoria) => {
    setCategoriaAbierta(categoriaAbierta === categoria ? null : categoria);
  };

  // MENÚ DE CAFETERÍA
  const menuCafeteria = [
    { nombre: 'Café Nevado', descripcion: 'Café, Crema batida', precio: '5.000 - 6.500' },
    { nombre: 'Chocolate', descripcion: 'Chocolate en agua o leche', precio: '3.000 - 3.500' },
    { nombre: 'Americano', descripcion: 'Café filtrado', precio: '6.500' },
    { nombre: 'Cappu Nevado', descripcion: 'Café, Crema batida, Leche', precio: '3.000' },
    { nombre: 'Espresso', descripcion: 'Café concentrado', precio: '3.500' },
    { nombre: 'Moca Nevado', descripcion: 'Café, Crema batida, Chocolate', precio: '7.500' },
    { nombre: 'Té Chai', descripcion: 'Té negro, Especias, Leche', precio: '5.000' },
    { nombre: 'Cappuccino', descripcion: 'Café, leche vaporizada', precio: '5.800 - 6.800' },
    { nombre: 'Cappuccino + Sabor', descripcion: 'Cappu + (Vainilla, Menta, Canela)', precio: '7.000' },
    { nombre: 'Moca', descripcion: 'Café, chocolate, leche vaporizada', precio: '7.000' },
    { nombre: 'Latte', descripcion: 'Café, Leche vaporizada', precio: '5.500 - 6.500' },
    { nombre: 'Frappé de café', descripcion: 'Café, Leche, Granizado, Crema batida', precio: '12.000' },
    { nombre: 'Frappé de Milo', descripcion: 'Milo, Leche, Granizado, Crema batida', precio: '11.000' },
    { nombre: 'Malteada Vainilla', descripcion: 'Helado de vainilla, Leche, Chantilly', precio: '11.500' },
    { nombre: 'Malteada de Arequipe', descripcion: 'Helado de Vainilla, Arequipe, Leche, Chantilly', precio: '12.500' },
    { nombre: 'Malteada de Oreo', descripcion: 'Helado, Oreo, Leche, Chantilly', precio: '12.500' },
    { nombre: 'Malteada de Café', descripcion: 'Helado, Café, Leche, Chantilly', precio: '13.500' },
    { nombre: 'Copa de Helado Normal', descripcion: 'Viene con diferentes frutas', precio: '4.000' },
    { nombre: 'Copa de Helado Premium', descripcion: 'Con frutas premium', precio: '6.500' },
    { nombre: 'Fresas con Crema', descripcion: 'Fresas frescas con crema', precio: '10.000' },
    { nombre: 'Fresas con Crema Premium', descripcion: 'Con chocolate, piazza, mini chips', precio: '12.000' }
  ];

  // MENÚ DE DESAYUNOS
  const menuDesayunos = [
    { nombre: 'Caldo de Costilla', descripcion: 'Acompañado de pan o arepa y bebida caliente', precio: '12.900' },
    { nombre: 'Caldo con huevo', descripcion: 'En agua o leche con bebida caliente', precio: '12.900' },
    { nombre: 'Caldo de Bagre', descripcion: 'Con pan o arepa y bebida caliente', precio: '17.000' },
    { nombre: 'Caldo de Pollo', descripcion: 'Con pan o arepa y bebida caliente', precio: '12.900' },
    { nombre: 'Huevos al gusto', descripcion: 'Pericos, Rancheros, Revueltos o Fritos', precio: '13.000' },
    { nombre: 'Tamal', descripcion: 'Con queso y pan tostado al ajillo y bebida caliente', precio: '15.000' },
    { nombre: 'Omelette', descripcion: 'Huevos, pollo desmechado, chorizo y vegetales', precio: '19.000' },
    { nombre: 'Huevos Benedictinos', descripcion: 'Con salsa holandesa', precio: '19.900' },
    { nombre: 'Tortilla Española', descripcion: 'Estilo tradicional', precio: '16.000' },
    { nombre: 'Tostadas Francesas', descripcion: 'Con dips de queso mozzarella', precio: '12.900' },
    { nombre: 'Desayuno Perfecto', descripcion: 'Caldo, arepa/pan, huevos y bebida caliente', precio: '19.500' }
  ];

  // MENÚ DE ALMUERZOS
  const menuAlmuerzos = [
    { nombre: 'Churrasco', descripcion: 'Con ensalada, papa criolla al ajillo, chorizo', precio: '47.000' },
    { nombre: 'Filet Mignon', descripcion: 'Medallones de Res con Salsa de Camarones', precio: '48.000' },
    { nombre: 'Ceviche Cartagenero', descripcion: 'Camarones marinados con verduras', precio: '30.000' },
    { nombre: 'Ceviche Peruano', descripcion: 'Camarones en salsa rosada con verduras', precio: '30.000' },
    { nombre: 'Ceviche Especial Maná', descripcion: 'Chicharrón marinado con patacones', precio: '50.000' },
    { nombre: 'Causita de Langostino', descripcion: 'Langostinos en puré de papa amarilla', precio: '31.900' },
    { nombre: 'Cordon Blue', descripcion: 'Pechuga rellena de jamón y queso', precio: '40.000' },
    { nombre: 'Pechuga Hawaiana', descripcion: 'Con piña asada caramelizada', precio: '34.000' },
    { nombre: 'Pasta Con Pollo 4 quesos', descripcion: 'Pasta con pechuga en salsa 4 quesos', precio: '40.000' },
    { nombre: 'Arroz Marinero', descripcion: 'Arroz con mixtura de mariscos', precio: '50.000' },
    { nombre: 'Pastas Green con Langostinos', descripcion: 'Fetuccini en salsa verde con langostinos', precio: '43.000' },
    { nombre: 'Salmón en salsa Frutos Rojos', descripcion: 'Lomo de salmón con papas francesas', precio: '48.000' },
    { nombre: 'Salmón a la Toscana', descripcion: 'Salmón con patacones y ensalada', precio: '52.000' }
  ];

  // MENÚ DE COMIDAS RÁPIDAS
  const menuComidasRapidas = [
    { nombre: 'Hamburguesa Clásica', descripcion: 'Carne artesanal, jamón, queso, vegetales', precio: '16.000' },
    { nombre: 'Hamburguesa Alemana', descripcion: 'Con mermelada de tocineta y cebolla caramelizada', precio: '21.000' },
    { nombre: 'Hamburguesa Doble', descripcion: 'Doble carne, jamón, queso, tocineta', precio: '23.000' },
    { nombre: 'Hamburguesa Especial Maná', descripcion: 'Con huevo, queso mozzarella, topping de tocineta', precio: '35.000' },
    { nombre: 'Hamburguesa Hawaiana', descripcion: 'Con piña asada caramelizada', precio: '35.000' },
    { nombre: 'Hot Dog Americano', descripcion: 'Salchicha, papa ripio, queso, tocineta', precio: '15.900' },
    { nombre: 'Hot Dog Mixto', descripcion: 'Salchicha, pollo desmechado, papa ripio', precio: '20.000' },
    { nombre: 'Hot Dog Argentino', descripcion: 'Chorizo argentino con chimichurri', precio: '22.000' },
    { nombre: 'Wrap Pollo', descripcion: 'Trozos de pechuga, vegetales, papas francesas', precio: '20.000' },
    { nombre: 'Wrap Carne', descripcion: 'Trozos de carne, vegetales, papas francesas', precio: '20.000' },
    { nombre: 'Wrap Mixto', descripcion: 'Carne y pollo con vegetales', precio: '23.000' },
    { nombre: 'Salchipapa Clásica', descripcion: 'Papas francesas, salchicha, salsas', precio: '16.000' },
    { nombre: 'Salchipapa de Pollo', descripcion: 'Con trozos de pechuga', precio: '20.000' },
    { nombre: 'Salchipapa Mixta', descripcion: 'Pollo y carne con papas', precio: '25.000' },
    { nombre: 'Picada Personal', descripcion: 'Mix de carnes, papas, chorizos', precio: '25.900' },
    { nombre: 'Picada Doble', descripcion: 'Para 2 personas', precio: '39.900' },
    { nombre: 'Picada Familiar', descripcion: 'Para toda la familia', precio: '64.900' }
  ];

  return (
    <section className="menu-page">
      <div className="menu-header">
        <h1 className="menu-title">Nuestro Menú</h1>
        <p className="menu-subtitle">Explora nuestras deliciosas opciones</p>
      </div>

      <div className="menu-container">
        {/* CAFETERÍA */}
        <div className="menu-categoria">
          <button 
            className={`menu-categoria-header ${categoriaAbierta === 'cafeteria' ? 'activo' : ''}`}
            onClick={() => toggleCategoria('cafeteria')}
          >
            <span className="menu-categoria-icono">☕</span>
            <span className="menu-categoria-nombre">Menú de Cafetería</span>
            <span className="menu-categoria-flecha">{categoriaAbierta === 'cafeteria' ? '▲' : '▼'}</span>
          </button>
          
          {categoriaAbierta === 'cafeteria' && (
            <div className="menu-items-grid">
              {menuCafeteria.map((item, index) => (
                <div key={index} className="menu-item-card">
                  <h3 className="menu-item-nombre">{item.nombre}</h3>
                  <p className="menu-item-descripcion">{item.descripcion}</p>
                  <p className="menu-item-precio">${item.precio}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DESAYUNOS */}
        <div className="menu-categoria">
          <button 
            className={`menu-categoria-header ${categoriaAbierta === 'desayunos' ? 'activo' : ''}`}
            onClick={() => toggleCategoria('desayunos')}
          >
            <span className="menu-categoria-icono">🍳</span>
            <span className="menu-categoria-nombre">Menú de Desayunos</span>
            <span className="menu-categoria-flecha">{categoriaAbierta === 'desayunos' ? '▲' : '▼'}</span>
          </button>
          
          {categoriaAbierta === 'desayunos' && (
            <div className="menu-items-grid">
              {menuDesayunos.map((item, index) => (
                <div key={index} className="menu-item-card">
                  <h3 className="menu-item-nombre">{item.nombre}</h3>
                  <p className="menu-item-descripcion">{item.descripcion}</p>
                  <p className="menu-item-precio">${item.precio}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ALMUERZOS */}
        <div className="menu-categoria">
          <button 
            className={`menu-categoria-header ${categoriaAbierta === 'almuerzos' ? 'activo' : ''}`}
            onClick={() => toggleCategoria('almuerzos')}
          >
            <span className="menu-categoria-icono">🍽️</span>
            <span className="menu-categoria-nombre">Menú de Almuerzos</span>
            <span className="menu-categoria-flecha">{categoriaAbierta === 'almuerzos' ? '▲' : '▼'}</span>
          </button>
          
          {categoriaAbierta === 'almuerzos' && (
            <div className="menu-items-grid">
              {menuAlmuerzos.map((item, index) => (
                <div key={index} className="menu-item-card">
                  <h3 className="menu-item-nombre">{item.nombre}</h3>
                  <p className="menu-item-descripcion">{item.descripcion}</p>
                  <p className="menu-item-precio">${item.precio}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COMIDAS RÁPIDAS */}
        <div className="menu-categoria">
          <button 
            className={`menu-categoria-header ${categoriaAbierta === 'rapidas' ? 'activo' : ''}`}
            onClick={() => toggleCategoria('rapidas')}
          >
            <span className="menu-categoria-icono">🍔</span>
            <span className="menu-categoria-nombre">Menú de Comidas Rápidas</span>
            <span className="menu-categoria-flecha">{categoriaAbierta === 'rapidas' ? '▲' : '▼'}</span>
          </button>
          
          {categoriaAbierta === 'rapidas' && (
            <div className="menu-items-grid">
              {menuComidasRapidas.map((item, index) => (
                <div key={index} className="menu-item-card">
                  <h3 className="menu-item-nombre">{item.nombre}</h3>
                  <p className="menu-item-descripcion">{item.descripcion}</p>
                  <p className="menu-item-precio">${item.precio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Menu;