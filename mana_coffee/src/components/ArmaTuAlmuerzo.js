import React, { useState } from 'react';
import './ArmaTuAlmuerzo.css';

function ArmaTuAlmuerzo() {
  // Estado para el carrito de compras
  const [carrito, setCarrito] = useState([]);

  // Productos disponibles (basados en la imagen del menú)
  const productos = [
    { id: 1, nombre: 'Arroz', precio: 4000, categoria: 'Base' },
    { id: 2, nombre: 'Papas a la Francesa', precio: 5200, categoria: 'Base' },
    { id: 3, nombre: 'Patacones', precio: 6500, categoria: 'Base' },
    { id: 4, nombre: 'Papas locas', precio: 9900, categoria: 'Base' },
    
    { id: 5, nombre: 'Carne (Res)', precio: 8900, categoria: 'Proteína' },
    { id: 6, nombre: 'Carne (Cerdo)', precio: 8900, categoria: 'Proteína' },
    { id: 7, nombre: 'Carne (Pechuga)', precio: 8900, categoria: 'Proteína' },
    
    { id: 8, nombre: 'Sopa del día', precio: 5000, categoria: 'Acompañamiento' },
    { id: 9, nombre: 'Ensalada del día', precio: 3200, categoria: 'Acompañamiento' },
    { id: 10, nombre: 'Tajadas de Maduro', precio: 3000, categoria: 'Acompañamiento' },
    { id: 11, nombre: 'Maíz', precio: 3000, categoria: 'Acompañamiento' },
    { id: 12, nombre: 'Tocineta', precio: 5000, categoria: 'Acompañamiento' },
    
    { id: 13, nombre: 'Huevo', precio: 3000, categoria: 'Extra' },
    { id: 14, nombre: 'Queso', precio: 3500, categoria: 'Extra' },
    { id: 15, nombre: 'Chorizo', precio: 4000, categoria: 'Extra' },
    { id: 16, nombre: 'Salchicha', precio: 3000, categoria: 'Extra' },
    { id: 17, nombre: 'Granos del día', precio: 4000, categoria: 'Extra' }
  ];

  // Agrupar productos por categoría
  const categorias = [...new Set(productos.map(p => p.categoria))];

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
      // Si ya existe, aumentar cantidad
      setCarrito(carrito.map(item => 
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      // Si no existe, agregar con cantidad 1
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Quitar producto del carrito
  const quitarDelCarrito = (producto) => {
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente.cantidad > 1) {
      // Si tiene más de 1, reducir cantidad
      setCarrito(carrito.map(item => 
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ));
    } else {
      // Si tiene 1, eliminar del carrito
      setCarrito(carrito.filter(item => item.id !== producto.id));
    }
  };

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Obtener cantidad de un producto en el carrito
  const getCantidadEnCarrito = (productoId) => {
    const item = carrito.find(item => item.id === productoId);
    return item ? item.cantidad : 0;
  };

  // Limpiar carrito
  const limpiarCarrito = () => {
    setCarrito([]);
  };

  // Enviar pedido por WhatsApp
  const enviarPorWhatsApp = () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de ordenar.');
      return;
    }

    // Número de WhatsApp de Mana Coffee (CAMBIA ESTE NÚMERO)
    const numeroWhatsApp = '573167231002'; // Formato: código país + número sin espacios ni guiones
    
    // Construir el mensaje
    let mensaje = '🍽️ *PEDIDO - MANA COFFEE*\n\n';
    mensaje += '📋 *Detalle del pedido:*\n';
    
    carrito.forEach(item => {
      mensaje += `• ${item.nombre} x${item.cantidad} - ${(item.precio * item.cantidad).toLocaleString('es-CO')}\n`;
    });
    
    mensaje += `\n💰 *TOTAL: ${calcularTotal().toLocaleString('es-CO')}*\n`;
    mensaje += `\n📝 *Nota:* Pedido para llevar (+$1.000)\n`;
    mensaje += `\n✅ Confirmo este pedido`;
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Abrir WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, '_blank');
    
    // Opcional: Limpiar carrito después de enviar
    // limpiarCarrito();
  };

  return (
    <section className="arma-tu-almuerzo">
      <div className="arma-header">
        <h2 className="arma-title">Construye tu Almuerzo</h2>
        <p className="arma-subtitle">Elige los ingredientes para crear tu almuerzo perfecto</p>
      </div>

      <div className="arma-container">
        {/* COLUMNA IZQUIERDA: PRODUCTOS */}
        <div className="productos-section">
          {categorias.map((categoria, index) => (
            <div key={index} className="categoria-card">
              <h3 className="categoria-title">{categoria}</h3>
              <div className="productos-grid">
                {productos
                  .filter(p => p.categoria === categoria)
                  .map(producto => {
                    const cantidadEnCarrito = getCantidadEnCarrito(producto.id);
                    
                    return (
                      <div key={producto.id} className="producto-item">
                        <div className="producto-info">
                          <h4 className="producto-nombre">{producto.nombre}</h4>
                          <p className="producto-precio">
                            ${producto.precio.toLocaleString('es-CO')}
                          </p>
                        </div>
                        
                        {cantidadEnCarrito === 0 ? (
                          <button 
                            className="btn-agregar"
                            onClick={() => agregarAlCarrito(producto)}
                          >
                            + Agregar
                          </button>
                        ) : (
                          <div className="cantidad-controls">
                            <button 
                              className="btn-cantidad"
                              onClick={() => quitarDelCarrito(producto)}
                            >
                              −
                            </button>
                            <span className="cantidad-display">{cantidadEnCarrito}</span>
                            <button 
                              className="btn-cantidad"
                              onClick={() => agregarAlCarrito(producto)}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* COLUMNA DERECHA: CARRITO */}
        <div className="carrito-section">
          <div className="carrito-sticky">
            <h3 className="carrito-title">Tu Pedido</h3>
            
            {carrito.length === 0 ? (
              <div className="carrito-vacio">
                <p>🍽️</p>
                <p>Agrega productos para armar tu almuerzo</p>
              </div>
            ) : (
              <>
                <div className="carrito-items">
                  {carrito.map(item => (
                    <div key={item.id} className="carrito-item">
                      <div className="carrito-item-info">
                        <span className="carrito-item-nombre">{item.nombre}</span>
                        <span className="carrito-item-cantidad">x{item.cantidad}</span>
                      </div>
                      <div className="carrito-item-precio">
                        ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="carrito-divider"></div>

                <div className="carrito-total">
                  <span className="total-label">Total:</span>
                  <span className="total-precio">
                    ${calcularTotal().toLocaleString('es-CO')}
                  </span>
                </div>

                <div className="carrito-acciones">
                  <button 
                    className="btn-limpiar"
                    onClick={limpiarCarrito}
                  >
                    🗑️ Limpiar
                  </button>
                  <button 
                    className="btn-ordenar"
                    onClick={enviarPorWhatsApp}
                  >
                    📱 Ordenar por WhatsApp
                  </button>
                </div>

                <div className="carrito-nota">
                  <p>💡 <strong>Nota:</strong> Todo pedido para llevar tiene un costo adicional de $1.000</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArmaTuAlmuerzo;