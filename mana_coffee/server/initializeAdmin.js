const bcrypt = require('bcryptjs');

async function initializeAdmin(db) {
  return new Promise((resolve, reject) => {
    const adminEmail = 'jcx10ten@gmail.com';
    const adminName = 'admin';
    const adminPassword = 'admin123';

    db.get('SELECT id, rol FROM usuarios WHERE email = ?', [adminEmail], async (err, usuario) => {
      if (err) {
        console.error('❌ Error verificando admin:', err);
        resolve(false);
        return;
      }

      if (usuario) {
        if (usuario.rol === 'admin') {
          console.log('✅ Admin ya existe con rol correcto');
          resolve(true);
        } else {
          db.run('UPDATE usuarios SET rol = ? WHERE id = ?', ['admin', usuario.id], (err) => {
            if (err) {
              console.error('❌ Error actualizando rol:', err);
              resolve(false);
            } else {
              console.log('✅ Admin actualizado a rol admin');
              resolve(true);
            }
          });
        }
      } else {
        bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
          if (err) {
            console.error('❌ Error hasheando contraseña:', err);
            resolve(false);
            return;
          }

          db.run(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [adminName, adminEmail, hashedPassword, 'admin'],
            (err) => {
              if (err) {
                console.error('❌ Error creando admin:', err);
                resolve(false);
              } else {
                console.log('✅ Admin creado exitosamente');
                console.log('   Email: jcx10ten@gmail.com');
                console.log('   Contraseña: admin123');
                resolve(true);
              }
            }
          );
        });
      }
    });
  });
}

module.exports = initializeAdmin;
