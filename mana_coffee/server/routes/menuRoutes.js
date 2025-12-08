// ==========================================
// RUTAS PARA GESTIÓN DEL MENÚ EN PDF
// Subir, obtener y eliminar PDFs del menú
// ==========================================

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verificarAdmin = require('../middleware/verificarAdmin');

const router = express.Router();
let db;

function inicializarRutas(database) {
  db = database;
  
  // ==========================================
  // CREAR TABLA DE MENUS SI NO EXISTE
  // (MOVIDO DENTRO DE inicializarRutas)
  // ==========================================
  db.run(`
    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_archivo TEXT NOT NULL,
      ruta_archivo TEXT NOT NULL,
      fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
      subido_por INTEGER,
      activo INTEGER DEFAULT 1,
      FOREIGN KEY (subido_por) REFERENCES usuarios(id)
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error al crear tabla menus:', err);
    } else {
      console.log('✅ Tabla menus lista');
    }
  });

  return router;
}

// ==========================================
// CONFIGURACIÓN DE MULTER PARA SUBIR PDFs
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/menus/';
    
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nombre único: menu-TIMESTAMP.pdf
    const uniqueName = `menu-${Date.now()}.pdf`;
    cb(null, uniqueName);
  }
});

// Filtro para aceptar solo PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // Límite de 10MB
  }
});

// ==========================================
// SUBIR NUEVO PDF DEL MENÚ
// POST /api/menu/subir
// (Solo administradores)
// ==========================================
router.post('/subir', verificarAdmin, upload.single('menu'), async (req, res) => {
  // Verificar que db esté definido
  if (!db) {
    return res.status(500).json({ 
      error: 'Base de datos no inicializada' 
    });
  }
  
  if (!req.file) {
    return res.status(400).json({ 
      error: 'No se subió ningún archivo' 
    });
  }

  try {
    const usuarioId = req.usuario.id;
    const nombreArchivo = req.file.filename;
    const rutaArchivo = req.file.path;

    // 1. Obtener el menú activo anterior
    db.get('SELECT * FROM menus WHERE activo = 1', [], (err, menuAntiguo) => {
      if (err) {
        console.error('Error al buscar menú antiguo:', err);
        return res.status(500).json({ 
          error: 'Error al buscar menú antiguo' 
        });
      }

      // 2. Desactivar todos los menús anteriores
      db.run('UPDATE menus SET activo = 0', [], (err) => {
        if (err) {
          console.error('Error al desactivar menús:', err);
          return res.status(500).json({ 
            error: 'Error al desactivar menús anteriores' 
          });
        }

        // 3. Eliminar archivo físico del menú antiguo
        if (menuAntiguo && menuAntiguo.ruta_archivo) {
          fs.unlink(menuAntiguo.ruta_archivo, (err) => {
            if (err) {
              console.error('Error al eliminar archivo antiguo:', err);
            } else {
              console.log('✅ Archivo antiguo eliminado:', menuAntiguo.ruta_archivo);
            }
          });
        }

        // 4. Insertar nuevo menú
        db.run(
          `INSERT INTO menus (nombre_archivo, ruta_archivo, subido_por, activo) 
           VALUES (?, ?, ?, 1)`,
          [nombreArchivo, rutaArchivo, usuarioId],
          function(err) {
            if (err) {
              console.error('Error al guardar menú:', err);
              return res.status(500).json({ 
                error: 'Error al guardar el menú en la base de datos' 
              });
            }

            res.json({
              mensaje: 'Menú actualizado exitosamente',
              menu: {
                id: this.lastID,
                nombre_archivo: nombreArchivo,
                ruta_archivo: rutaArchivo,
                fecha_subida: new Date().toISOString()
              }
            });
          }
        );
      });
    });

  } catch (error) {
    console.error('Error al subir menú:', error);
    res.status(500).json({ 
      error: 'Error al subir el menú' 
    });
  }
});

// ==========================================
// OBTENER MENÚ ACTIVO
// GET /api/menu/actual
// ==========================================
router.get('/actual', (req, res) => {
  if (!db) {
    return res.status(500).json({ 
      error: 'Base de datos no inicializada' 
    });
  }
  
  db.get(
    `SELECT m.*, u.nombre as subido_por_nombre 
     FROM menus m 
     LEFT JOIN usuarios u ON m.subido_por = u.id 
     WHERE m.activo = 1`,
    [],
    (err, menu) => {
      if (err) {
        console.error('Error al obtener menú:', err);
        return res.status(500).json({ 
          error: 'Error al obtener el menú' 
        });
      }

      if (!menu) {
        return res.json({ 
          menu: null,
          mensaje: 'No hay menú disponible' 
        });
      }

      res.json({ menu });
    }
  );
});

// ==========================================
// SERVIR ARCHIVO PDF
// GET /api/menu/pdf/:filename
// ==========================================
router.get('/pdf/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '../uploads/menus/', filename);

  // Verificar que el archivo existe
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ 
      error: 'Archivo no encontrado' 
    });
  }

  // Enviar el archivo
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=' + filename);
  
  const fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);
});

// ==========================================
// OBTENER HISTORIAL DE MENÚS (Para admin)
// GET /api/menu/historial
// ==========================================
router.get('/historial', verificarAdmin, (req, res) => {
  if (!db) {
    return res.status(500).json({ 
      error: 'Base de datos no inicializada' 
    });
  }
  
  db.all(
    `SELECT m.*, u.nombre as subido_por_nombre 
     FROM menus m 
     LEFT JOIN usuarios u ON m.subido_por = u.id 
     ORDER BY m.fecha_subida DESC`,
    [],
    (err, menus) => {
      if (err) {
        console.error('Error al obtener historial:', err);
        return res.status(500).json({ 
          error: 'Error al obtener historial' 
        });
      }

      res.json({ 
        total: menus.length,
        menus: menus 
      });
    }
  );
});

// ==========================================
// LIMPIAR MENÚS ANTIGUOS (Mantenimiento)
// DELETE /api/menu/limpiar-antiguos
// ==========================================
router.delete('/limpiar-antiguos', verificarAdmin, (req, res) => {
  if (!db) {
    return res.status(500).json({ 
      error: 'Base de datos no inicializada' 
    });
  }
  
  // Obtener menús inactivos
  db.all('SELECT * FROM menus WHERE activo = 0', [], (err, menusAntiguos) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al obtener menús antiguos' 
      });
    }

    let eliminados = 0;

    // Eliminar archivos físicos
    menusAntiguos.forEach(menu => {
      fs.unlink(menu.ruta_archivo, (err) => {
        if (err) {
          console.error('Error al eliminar:', menu.ruta_archivo);
        } else {
          eliminados++;
        }
      });
    });

    // Eliminar registros de la base de datos
    db.run('DELETE FROM menus WHERE activo = 0', [], (err) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Error al eliminar registros' 
        });
      }

      res.json({
        mensaje: 'Limpieza completada',
        archivos_eliminados: eliminados
      });
    });
  });
});

module.exports = inicializarRutas;