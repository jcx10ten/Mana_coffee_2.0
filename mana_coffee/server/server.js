require('dotenv').config();

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== VALIDACIÓN DE SEGURIDAD ====================
const JWT_SECRET = process.env.JWT_SECRET;

console.log('🔐 JWT_SECRET cargada:', JWT_SECRET ? '✅ SÍ' : '❌ NO');

if (!JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET no está definida en el archivo .env');
  console.error('   Verifica que tu archivo .env tenga: JWT_SECRET=tu_clave_secreta');
  process.exit(1);
}

if (JWT_SECRET === 'mi_clave_super_secreta' || JWT_SECRET.length < 10) {
  console.error('❌ ERROR: Usa una clave JWT más segura en tu .env');
  console.error('   La clave debe tener al menos 32 caracteres');
  process.exit(1);
}

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== CONEXIÓN A BASE DE DATOS ====================
const db = new sqlite3.Database(process.env.DB_PATH || './database.db', (err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1);
  } else {
    console.log('✅ Conectado a SQLite');
  }
});

// ==================== CREAR TABLAS ====================

// Tabla de usuarios
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('❌ Error al crear tabla usuarios:', err);
  } else {
    console.log('✅ Tabla usuarios lista');
  }
});

// Tabla de reservas
db.run(`
  CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    telefono TEXT NOT NULL,
    num_personas INTEGER NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    comentarios TEXT,
    estado TEXT DEFAULT 'confirmada',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) {
    console.error('❌ Error al crear tabla reservas:', err);
  } else {
    console.log('✅ Tabla reservas lista');
  }
});

// ==================== IMPORTAR RUTAS ====================

// Importar y configurar rutas de autenticación
const authRoutes = require('./routes/authRoutes')(db);
app.use('/api/auth', authRoutes);

// Importar y configurar rutas de reservas
const reservasRoutes = require('./routes/reservasRoutes')(db);
app.use('/api/reservas', reservasRoutes);

const adminRoutes = require('./routes/adminRoutes')(db);
app.use('/api/admin', adminRoutes);

// ==================== RUTA DE PRUEBA ====================
app.get('/api', (req, res) => {
  res.json({ 
    mensaje: '✅ Servidor de Mana Coffee funcionando',
    version: '2.0.0 - Modular',
    timestamp: new Date().toISOString(),
    rutas_disponibles: {
      autenticacion: '/api/auth',
      reservas: '/api/reservas'
    }
  });
});

// ==================== MANEJO DE ERRORES 404 ====================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    ruta_solicitada: req.url
  });
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Servidor de Mana Coffee iniciado');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🔐 JWT_SECRET: ${JWT_SECRET ? '✅ Cargada' : '❌ Error'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('📊 Base de datos: SQLite');
  console.log('📁 Estructura modular:');
  console.log('   └── /api/auth      (login, registro, perfil)');
  console.log('   └── /api/reservas  (CRUD de reservas)');
  console.log('='.repeat(60));
});