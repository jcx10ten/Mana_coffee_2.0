const express = require('express');
const verificarAdmin = require('../middleware/verificarAdmin');

const router = express.Router();
let db;

function inicializarRutas(database) {
  db = database;
  return router;
}

// ==========================================
// DASHBOARD - ESTADÍSTICAS GENERALES
// GET /api/admin/dashboard
// ==========================================
router.get('/dashboard', verificarAdmin, (req, res) => {
  const queries = {
    totalReservasHoy: `
      SELECT COUNT(*) as total 
      FROM reservas 
      WHERE fecha = date('now')
    `,
    totalReservasSemana: `
      SELECT COUNT(*) as total 
      FROM reservas 
      WHERE fecha BETWEEN date('now') AND date('now', '+7 days')
    `,
    totalUsuarios: `
      SELECT COUNT(*) as total 
      FROM usuarios
    `,
    reservasRecientes: `
      SELECT r.*, u.nombre, u.email 
      FROM reservas r 
      JOIN usuarios u ON r.usuario_id = u.id 
      ORDER BY r.fecha_creacion DESC 
      LIMIT 10
    `,
    reservasPorEstado: `
      SELECT estado, COUNT(*) as total 
      FROM reservas 
      GROUP BY estado
    `
  };

  const resultados = {};
  let completadas = 0;

  // Total reservas hoy
  db.get(queries.totalReservasHoy, [], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error en base de datos' });
    resultados.totalReservasHoy = row.total;
    completadas++;
    if (completadas === 5) enviarRespuesta();
  });

  // Total reservas próxima semana
  db.get(queries.totalReservasSemana, [], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error en base de datos' });
    resultados.totalReservasSemana = row.total;
    completadas++;
    if (completadas === 5) enviarRespuesta();
  });

  // Total usuarios
  db.get(queries.totalUsuarios, [], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error en base de datos' });
    resultados.totalUsuarios = row.total;
    completadas++;
    if (completadas === 5) enviarRespuesta();
  });

  // Reservas recientes
  db.all(queries.reservasRecientes, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error en base de datos' });
    resultados.reservasRecientes = rows;
    completadas++;
    if (completadas === 5) enviarRespuesta();
  });

  // Reservas por estado
  db.all(queries.reservasPorEstado, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error en base de datos' });
    resultados.reservasPorEstado = rows;
    completadas++;
    if (completadas === 5) enviarRespuesta();
  });

  function enviarRespuesta() {
    res.json(resultados);
  }
});

// ==========================================
// OBTENER TODAS LAS RESERVAS (CON FILTROS)
// GET /api/admin/reservas
// ==========================================
router.get('/reservas', verificarAdmin, (req, res) => {
  const { fecha, estado, buscar } = req.query;
  
  let query = `
    SELECT r.*, u.nombre, u.email 
    FROM reservas r 
    JOIN usuarios u ON r.usuario_id = u.id 
    WHERE 1=1
  `;
  const params = [];

  if (fecha) {
    query += ' AND r.fecha = ?';
    params.push(fecha);
  }

  if (estado) {
    query += ' AND r.estado = ?';
    params.push(estado);
  }

  if (buscar) {
    query += ' AND (u.nombre LIKE ? OR u.email LIKE ? OR r.telefono LIKE ?)';
    params.push(`%${buscar}%`, `%${buscar}%`, `%${buscar}%`);
  }

  query += ' ORDER BY r.fecha DESC, r.hora DESC';

  db.all(query, params, (err, reservas) => {
    if (err) {
      console.error('Error al obtener reservas:', err);
      return res.status(500).json({ error: 'Error al obtener reservas' });
    }

    res.json({
      total: reservas.length,
      reservas: reservas
    });
  });
});

// ==========================================
// ACTUALIZAR CUALQUIER RESERVA
// PUT /api/admin/reservas/:id
// ==========================================
router.put('/reservas/:id', verificarAdmin, (req, res) => {
  const { id } = req.params;
  const { telefono, num_personas, fecha, hora, estado, comentarios } = req.body;

  db.run(
    `UPDATE reservas 
     SET telefono = ?, num_personas = ?, fecha = ?, hora = ?, estado = ?, comentarios = ?
     WHERE id = ?`,
    [telefono, num_personas, fecha, hora, estado || 'confirmada', comentarios || '', id],
    function(err) {
      if (err) {
        console.error('Error al actualizar reserva:', err);
        return res.status(500).json({ error: 'Error al actualizar reserva' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      db.get(
        `SELECT r.*, u.nombre, u.email 
         FROM reservas r 
         JOIN usuarios u ON r.usuario_id = u.id 
         WHERE r.id = ?`,
        [id],
        (err, reserva) => {
          if (err) {
            return res.status(500).json({ error: 'Error al obtener reserva' });
          }

          res.json({ 
            mensaje: 'Reserva actualizada exitosamente',
            reserva: reserva
          });
        }
      );
    }
  );
});

// ==========================================
// ELIMINAR CUALQUIER RESERVA
// DELETE /api/admin/reservas/:id
// ==========================================
router.delete('/reservas/:id', verificarAdmin, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM reservas WHERE id = ?', [id], (err, reserva) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    db.run('DELETE FROM reservas WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al eliminar reserva' });
      }

      res.json({ 
        mensaje: 'Reserva eliminada exitosamente',
        reserva_eliminada: reserva
      });
    });
  });
});

// ==========================================
// OBTENER TODOS LOS USUARIOS
// GET /api/admin/usuarios
// ==========================================
router.get('/usuarios', verificarAdmin, (req, res) => {
  db.all(
    `SELECT id, nombre, email, rol, fecha_registro 
     FROM usuarios 
     ORDER BY fecha_registro DESC`,
    [],
    (err, usuarios) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener usuarios' });
      }

      res.json({
        total: usuarios.length,
        usuarios: usuarios
      });
    }
  );
});

// ==========================================
// CAMBIAR ROL DE USUARIO
// PATCH /api/admin/usuarios/:id/rol
// ==========================================
router.patch('/usuarios/:id/rol', verificarAdmin, (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  if (!['cliente', 'admin'].includes(rol)) {
    return res.status(400).json({ 
      error: 'Rol inválido. Debe ser "cliente" o "admin"' 
    });
  }

  db.run(
    'UPDATE usuarios SET rol = ? WHERE id = ?',
    [rol, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar rol' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ 
        mensaje: `Rol actualizado a: ${rol}`,
        usuario_id: id
      });
    }
  );
});

// ==========================================
// OBTENER HISTORIAL DE UN USUARIO
// GET /api/admin/usuarios/:id/reservas
// ==========================================
router.get('/usuarios/:id/reservas', verificarAdmin, (req, res) => {
  const { id } = req.params;

  db.all(
    `SELECT r.*, u.nombre, u.email 
     FROM reservas r 
     JOIN usuarios u ON r.usuario_id = u.id 
     WHERE r.usuario_id = ? 
     ORDER BY r.fecha DESC`,
    [id],
    (err, reservas) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener reservas' });
      }

      res.json({
        total: reservas.length,
        reservas: reservas
      });
    }
  );
});

module.exports = inicializarRutas;