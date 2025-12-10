require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/mana_coffee/server/database.db'
  : path.join(__dirname, './database.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1);
  }
  console.log('✅ Conectado a la base de datos en:', DB_PATH);
});

async function crearAdminFijo() {
  try {
    const nombre = 'admin';
    const email = 'jcx10ten@gmail.com';
    const password = 'admin123';

    console.log('🔐 Hasheando contraseña...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('📝 Verificando si el admin ya existe...');
    
    db.get('SELECT id FROM usuarios WHERE email = ?', [email], (err, usuario) => {
      if (err) {
        console.error('❌ Error:', err);
        db.close();
        process.exit(1);
      }

      if (usuario) {
        console.log('⚠️  El usuario ya existe. Actualizando rol a admin...');
        db.run(
          'UPDATE usuarios SET rol = ? WHERE email = ?',
          ['admin', email],
          function(err) {
            if (err) {
              console.error('❌ Error al actualizar:', err);
            } else {
              console.log('✅ Usuario actualizado a admin exitosamente');
            }
            db.close();
          }
        );
      } else {
        console.log('➕ Creando nuevo usuario admin...');
        db.run(
          'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
          [nombre, email, hashedPassword, 'admin'],
          function(err) {
            if (err) {
              console.error('❌ Error al crear usuario:', err);
            } else {
              console.log('✅ Admin creado exitosamente');
              console.log('━'.repeat(60));
              console.log('📊 Datos del admin:');
              console.log(`   Nombre: ${nombre}`);
              console.log(`   Email: ${email}`);
              console.log(`   Contraseña: ${password}`);
              console.log(`   Rol: admin`);
              console.log('━'.repeat(60));
            }
            db.close();
          }
        );
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    db.close();
    process.exit(1);
  }
}

crearAdminFijo();
