const jwt = require('jsonwebtoken');

function verificarAdmin(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ 
      error: 'Acceso denegado. Token no proporcionado.' 
    });
  }

  try {
    // Extraer el token (quitar "Bearer " si existe)
    const tokenLimpio = token.replace('Bearer ', '');
    
    // Verificar y decodificar el token
    const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    
    // Verificar que el usuario sea administrador
    if (decoded.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'Acceso denegado. Esta función es solo para administradores.' 
      });
    }
    
    // Agregar información del usuario a la request
    req.usuario = decoded;
    
    // Continuar con la siguiente función
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.' 
    });
  }
}

module.exports = verificarAdmin;