const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Esta variable 'db' será inyectada desde server.js
let db;

// Función para inicializar el router con la base de datos
function inicializarRutas(database) {
  db = database;
  return router;
}

// ==========================================
// 1. REGISTRAR USUARIO
// POST /api/auth/registro
// ==========================================
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validaciones básicas
  if (!nombre || !email || !password) {
    return res.status(400).json({ 
      error: 'Todos los campos son obligatorios' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'La contraseña debe tener al menos 6 caracteres' 
    });
  }

  // Verificar si el email ya existe
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, row) => {
    if (err) {
      console.error('Error al verificar email:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (row) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }

    try {
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar usuario en la base de datos
      db.run(
        'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, hashedPassword],
        function(err) {
          if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ error: 'Error al registrar usuario' });
          }

          res.status(201).json({ 
            mensaje: 'Usuario registrado exitosamente',
            id: this.lastID 
          });
        }
      );
    } catch (error) {
      console.error('Error al encriptar contraseña:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
});

// ==========================================
// 2. INICIAR SESIÓN
// POST /api/auth/login
// ==========================================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validaciones
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email y contraseña son obligatorios' 
    });
  }

  // Buscar usuario en la base de datos
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, usuario) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (!usuario) {
      return res.status(401).json({ 
        error: 'Email o contraseña incorrectos' 
      });
    }

    try {
      // Verificar contraseña
      const passwordValida = await bcrypt.compare(password, usuario.password);

      if (!passwordValida) {
        return res.status(401).json({ 
          error: 'Email o contraseña incorrectos' 
        });
      }

      // Crear token JWT (✅ CON ROL INCLUIDO)
      const token = jwt.sign(
  { 
    id: usuario.id, 
    email: usuario.email,
    nombre: usuario.nombre 
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

      // Responder con token y datos del usuario (✅ CON ROL INCLUIDO)
      res.json({
  mensaje: 'Login exitoso',
  token: token,
  usuario: {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol || 'cliente'  // ✅ AGREGAR ESTA LÍNEA
  }
});
    } catch (error) {
      console.error('Error al verificar contraseña:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  });
});

// ==========================================
// 3. OBTENER PERFIL DEL USUARIO
// GET /api/auth/perfil
// (RUTA PROTEGIDA)
// ==========================================
router.get('/perfil', verificarToken, (req, res) => {
  db.get(
    'SELECT id, nombre, email, rol, fecha_registro FROM usuarios WHERE id = ?', 
    [req.usuario.id], 
    (err, usuario) => {
      if (err) {
        console.error('Error al obtener perfil:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json(usuario);
    }
  );
});

// ==========================================
// 4. OBTENER TODOS LOS USUARIOS
// GET /api/auth/usuarios
// (Solo para pruebas/desarrollo)
// ==========================================
router.get('/usuarios', (req, res) => {
  db.all(
    'SELECT id, nombre, email, rol, fecha_registro FROM usuarios', 
    [], 
    (err, usuarios) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.json(usuarios);
    }
  );
});

module.exports = inicializarRutas;