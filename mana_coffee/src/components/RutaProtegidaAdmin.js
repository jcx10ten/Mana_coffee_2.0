import React from 'react';
import { Navigate } from 'react-router-dom';

function RutaProtegidaAdmin({ children }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');

  // Si no hay token o usuario, redirigir al login
  if (!token || !usuario) {
    alert('Debes iniciar sesión para acceder a esta página');
    return <Navigate to="/iniciar-sesion" />;
  }

  // Si el usuario no es admin, redirigir al inicio
  if (usuario.rol !== 'admin') {
    alert('Acceso denegado. Esta área es solo para administradores.');
    return <Navigate to="/" />;
  }

  return children;
}

export default RutaProtegidaAdmin;