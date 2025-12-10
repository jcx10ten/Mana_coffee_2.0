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
        bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
          if (err) {
            console.error('❌ Error hasheando contraseña:', err);
            resolve(false);
            return;
          }

          db.run(
            'UPDATE usuarios SET nombre = ?, password = ?, rol = ? WHERE id = ?',
            [adminName, hashedPassword, 'admin', usuario.id],
            (err) => {
              if (err) {
                console.error('❌ Error actualizando admin:', err);
                resolve(false);
              } else {
                console.log('✅ Admin actualizado (nombre, rol y contraseña)');
                console.log('   Email: jcx10ten@gmail.com');
                console.log('   Contraseña: admin123');
                resolve(true);
              }
            }
          );
        });
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
