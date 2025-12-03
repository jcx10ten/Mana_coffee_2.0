import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente que protege rutas que requieren autenticación
function RutaProtegida({ children }) {
  // Verificar si hay un token en localStorage
  const token = localStorage.getItem('token');

  // Si no hay token, redirigir al login
  if (!token) {
    alert('Debes iniciar sesión para hacer una reserva');
    return <Navigate to="/iniciar-sesion" replace />;
  }

  // Si hay token, mostrar el componente protegido
  return children;
}

export default RutaProtegida;