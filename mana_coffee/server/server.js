require('dotenv').config();

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

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

// ✅ NUEVO: Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== CONFIGURACIÓN DE BASE DE DATOS ====================
// Detectar ruta según el entorno (producción o desarrollo)
const DB_PATH = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/server/database.db'
  : process.env.DB_PATH || './database.db';

console.log('📊 Usando base de datos en:', DB_PATH);

// ==================== CONEXIÓN A BASE DE DATOS ====================
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1);
  } else {
    console.log('✅ Conectado a SQLite en:', DB_PATH);
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
    rol TEXT DEFAULT 'cliente',
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

// Importar y configurar rutas de administración
const adminRoutes = require('./routes/adminRoutes')(db);
app.use('/api/admin', adminRoutes);

// ✅ NUEVO: Importar y configurar rutas de menú
const menuRoutes = require('./routes/menuRoutes')(db);
app.use('/api/menu', menuRoutes);

// ==================== RUTA DE PRUEBA ====================
app.get('/api', (req, res) => {
  res.json({ 
    mensaje: '✅ Servidor de Mana Coffee funcionando',
    version: '2.1.0 - Con gestión de menú en PDF',
    timestamp: new Date().toISOString(),
    rutas_disponibles: {
      autenticacion: '/api/auth',
      reservas: '/api/reservas',
      admin: '/api/admin',
      menu: '/api/menu'
    }
  });
});

// ==================== SERVIR FRONTEND EN PRODUCCIÓN ====================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

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
  console.log('   └── /api/admin     (panel administrativo)');
  console.log('   └── /api/menu      (gestión de menú en PDF)');
  console.log('='.repeat(60));
});