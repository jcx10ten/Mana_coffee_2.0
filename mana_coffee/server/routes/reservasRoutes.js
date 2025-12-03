// ==========================================
// RUTAS DE RESERVAS
// Crear, listar, cancelar reservas
// ==========================================

const express = require('express');
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
// 1. CREAR NUEVA RESERVA
// POST /api/reservas
// (RUTA PROTEGIDA - requiere autenticación)
// ==========================================
router.post('/', verificarToken, (req, res) => {
  const { telefono, num_personas, fecha, hora, comentarios } = req.body;
  const usuario_id = req.usuario.id;

  // ========== VALIDACIONES ==========
  
  // Validar campos obligatorios
  if (!telefono || !num_personas || !fecha || !hora) {
    return res.status(400).json({ 
      error: 'Teléfono, número de personas, fecha y hora son obligatorios' 
    });
  }

  // Validar teléfono (10 dígitos)
  const telefonoLimpio = telefono.replace(/\s/g, '');
  if (!/^[0-9]{10}$/.test(telefonoLimpio)) {
    return res.status(400).json({ 
      error: 'El teléfono debe tener 10 dígitos' 
    });
  }

  // Validar número de personas (1-42)
  const numPersonasInt = parseInt(num_personas);
  if (isNaN(numPersonasInt) || numPersonasInt < 1 || numPersonasInt > 42) {
    return res.status(400).json({ 
      error: 'El número de personas debe estar entre 1 y 42' 
    });
  }

  // Validar que la fecha no sea anterior a hoy
  const fechaReserva = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (fechaReserva < hoy) {
    return res.status(400).json({ 
      error: 'La fecha de reserva no puede ser anterior a hoy' 
    });
  }

  // Validar horario (8:00 - 22:00)
  const [horas, minutos] = hora.split(':').map(Number);
  if (horas < 8 || horas >= 22) {
    return res.status(400).json({ 
      error: 'El horario debe estar entre 8:00 AM y 10:00 PM' 
    });
  }

  // ========== INSERTAR RESERVA ==========
  
  db.run(
    `INSERT INTO reservas 
     (usuario_id, telefono, num_personas, fecha, hora, comentarios, estado) 
     VALUES (?, ?, ?, ?, ?, ?, 'confirmada')`,
    [usuario_id, telefono, numPersonasInt, fecha, hora, comentarios || ''],
    function(err) {
      if (err) {
        console.error('Error al crear reserva:', err);
        return res.status(500).json({ 
          error: 'Error al crear la reserva' 
        });
      }

      // Obtener los datos completos de la reserva recién creada
      db.get(
        `SELECT r.*, u.nombre, u.email 
         FROM reservas r 
         JOIN usuarios u ON r.usuario_id = u.id 
         WHERE r.id = ?`,
        [this.lastID],
        (err, reserva) => {
          if (err) {
            console.error('Error al obtener reserva:', err);
            return res.status(500).json({ 
              error: 'Reserva creada pero error al obtener detalles' 
            });
          }

          res.status(201).json({ 
            mensaje: 'Reserva creada exitosamente',
            reserva: reserva
          });
        }
      );
    }
  );
});

// ==========================================
// 2. OBTENER MIS RESERVAS
// GET /api/reservas/mis-reservas
// (RUTA PROTEGIDA - solo reservas del usuario logueado)
// ==========================================
router.get('/mis-reservas', verificarToken, (req, res) => {
  const usuario_id = req.usuario.id;

  db.all(
    `SELECT r.*, u.nombre, u.email 
     FROM reservas r 
     JOIN usuarios u ON r.usuario_id = u.id 
     WHERE r.usuario_id = ? 
     ORDER BY r.fecha DESC, r.hora DESC`,
    [usuario_id],
    (err, reservas) => {
      if (err) {
        console.error('Error al obtener reservas:', err);
        return res.status(500).json({ 
          error: 'Error al obtener reservas' 
        });
      }

      res.json({
        total: reservas.length,
        reservas: reservas
      });
    }
  );
});

// ==========================================
// 3. OBTENER TODAS LAS RESERVAS
// GET /api/reservas
// (RUTA PROTEGIDA - para administradores)
// ==========================================
router.get('/', verificarToken, (req, res) => {
  db.all(
    `SELECT r.*, u.nombre, u.email 
     FROM reservas r 
     JOIN usuarios u ON r.usuario_id = u.id 
     ORDER BY r.fecha DESC, r.hora DESC`,
    [],
    (err, reservas) => {
      if (err) {
        console.error('Error al obtener todas las reservas:', err);
        return res.status(500).json({ 
          error: 'Error al obtener reservas' 
        });
      }

      res.json({
        total: reservas.length,
        reservas: reservas
      });
    }
  );
});

// ==========================================
// 4. OBTENER UNA RESERVA POR ID
// GET /api/reservas/:id
// (RUTA PROTEGIDA)
// ==========================================
router.get('/:id', verificarToken, (req, res) => {
  const reserva_id = req.params.id;
  const usuario_id = req.usuario.id;

  db.get(
    `SELECT r.*, u.nombre, u.email 
     FROM reservas r 
     JOIN usuarios u ON r.usuario_id = u.id 
     WHERE r.id = ? AND r.usuario_id = ?`,
    [reserva_id, usuario_id],
    (err, reserva) => {
      if (err) {
        console.error('Error al obtener reserva:', err);
        return res.status(500).json({ 
          error: 'Error en el servidor' 
        });
      }

      if (!reserva) {
        return res.status(404).json({ 
          error: 'Reserva no encontrada' 
        });
      }

      res.json(reserva);
    }
  );
});

// ==========================================
// 5. CANCELAR RESERVA
// DELETE /api/reservas/:id
// (RUTA PROTEGIDA - solo el dueño puede cancelar)
// ==========================================
router.delete('/:id', verificarToken, (req, res) => {
  const reserva_id = req.params.id;
  const usuario_id = req.usuario.id;

  // Verificar que la reserva exista y pertenezca al usuario
  db.get(
    'SELECT * FROM reservas WHERE id = ? AND usuario_id = ?',
    [reserva_id, usuario_id],
    (err, reserva) => {
      if (err) {
        console.error('Error al verificar reserva:', err);
        return res.status(500).json({ 
          error: 'Error en el servidor' 
        });
      }

      if (!reserva) {
        return res.status(404).json({ 
          error: 'Reserva no encontrada o no tienes permiso para cancelarla' 
        });
      }

      // Eliminar la reserva
      db.run(
        'DELETE FROM reservas WHERE id = ?', 
        [reserva_id], 
        (err) => {
          if (err) {
            console.error('Error al cancelar reserva:', err);
            return res.status(500).json({ 
              error: 'Error al cancelar reserva' 
            });
          }

          res.json({ 
            mensaje: 'Reserva cancelada exitosamente',
            reserva_cancelada: reserva
          });
        }
      );
    }
  );
});

// ==========================================
// 6. ACTUALIZAR ESTADO DE RESERVA
// PATCH /api/reservas/:id/estado
// (Para administradores - cambiar estado a confirmada/cancelada/completada)
// ==========================================
router.patch('/:id/estado', verificarToken, (req, res) => {
  const reserva_id = req.params.id;
  const { estado } = req.body;

  // Validar estados permitidos
  const estadosValidos = ['pendiente', 'confirmada', 'cancelada', 'completada'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ 
      error: `Estado inválido. Estados permitidos: ${estadosValidos.join(', ')}` 
    });
  }

  db.run(
    'UPDATE reservas SET estado = ? WHERE id = ?',
    [estado, reserva_id],
    function(err) {
      if (err) {
        console.error('Error al actualizar estado:', err);
        return res.status(500).json({ 
          error: 'Error al actualizar estado' 
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({ 
          error: 'Reserva no encontrada' 
        });
      }

      res.json({ 
        mensaje: `Estado actualizado a: ${estado}`,
        reserva_id: reserva_id
      });
    }
  );
});

// ==========================================
// ACTUALIZAR RESERVA
// PUT /api/reservas/:id
// (RUTA PROTEGIDA)
// ==========================================
router.put('/:id', verificarToken, (req, res) => {
  const reserva_id = req.params.id;
  const usuario_id = req.usuario.id;
  const { telefono, num_personas, fecha, hora, comentarios } = req.body;

  // Verificar que la reserva pertenezca al usuario
  db.get(
    'SELECT * FROM reservas WHERE id = ? AND usuario_id = ?',
    [reserva_id, usuario_id],
    (err, reserva) => {
      if (err) {
        console.error('Error al verificar reserva:', err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }

      if (!reserva) {
        return res.status(404).json({ 
          error: 'Reserva no encontrada o no tienes permiso para editarla' 
        });
      }

      // Actualizar la reserva
      db.run(
        `UPDATE reservas 
         SET telefono = ?, num_personas = ?, fecha = ?, hora = ?, comentarios = ?
         WHERE id = ?`,
        [telefono, num_personas, fecha, hora, comentarios || '', reserva_id],
        function(err) {
          if (err) {
            console.error('Error al actualizar reserva:', err);
            return res.status(500).json({ error: 'Error al actualizar reserva' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: 'No se pudo actualizar' });
          }

          // Obtener la reserva actualizada
          db.get(
            `SELECT r.*, u.nombre, u.email 
             FROM reservas r 
             JOIN usuarios u ON r.usuario_id = u.id 
             WHERE r.id = ?`,
            [reserva_id],
            (err, reservaActualizada) => {
              if (err) {
                return res.status(500).json({ error: 'Error al obtener reserva' });
              }

              res.json({ 
                mensaje: 'Reserva actualizada exitosamente',
                reserva: reservaActualizada
              });
            }
          );
        }
      );
    }
  );
});

module.exports = inicializarRutas;