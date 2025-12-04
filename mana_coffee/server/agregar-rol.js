const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1);
  }
  console.log('✅ Conectado a la base de datos');
});

// Función para verificar si la columna 'rol' ya existe
function verificarColumnaRol() {
  return new Promise((resolve, reject) => {
    db.get("PRAGMA table_info(usuarios)", (err, row) => {
      if (err) {
        reject(err);
      } else {
        // Verificar si existe la columna 'rol'
        db.all("PRAGMA table_info(usuarios)", (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const columnaExiste = rows.some(col => col.name === 'rol');
            resolve(columnaExiste);
          }
        });
      }
    });
  });
}

// Ejecutar la migración
async function ejecutarMigracion() {
  try {
    console.log('🔍 Verificando estructura de la base de datos...');
    
    const columnaExiste = await verificarColumnaRol();
    
    if (columnaExiste) {
      console.log('⚠️  La columna "rol" ya existe. Saltando creación.');
    } else {
      console.log('📝 Agregando columna "rol"...');
      
      await new Promise((resolve, reject) => {
        db.run(
          "ALTER TABLE usuarios ADD COLUMN rol TEXT DEFAULT 'cliente'",
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      
      console.log('✅ Columna "rol" agregada exitosamente');
    }

    // Actualizar usuarios existentes para que tengan el rol 'cliente'
    console.log('📝 Actualizando usuarios existentes...');
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE usuarios SET rol = 'cliente' WHERE rol IS NULL",
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Mostrar todos los usuarios
    console.log('\n👥 Usuarios en la base de datos:');
    console.log('━'.repeat(70));
    
    db.all('SELECT id, nombre, email, rol FROM usuarios', (err, usuarios) => {
      if (err) {
        console.error('❌ Error al obtener usuarios:', err);
      } else {
        if (usuarios.length === 0) {
          console.log('   No hay usuarios registrados todavía.');
          console.log('   Registra un usuario desde la aplicación y luego ejecuta:');
          console.log('   UPDATE usuarios SET rol = \'admin\' WHERE id = 1;');
        } else {
          usuarios.forEach(u => {
            console.log(`   ID: ${u.id} | ${u.nombre} | ${u.email} | Rol: ${u.rol || 'cliente'}`);
          });
          
          console.log('\n💡 Para hacer admin a un usuario, ejecuta:');
          console.log(`   UPDATE usuarios SET rol = 'admin' WHERE id = 1;`);
          console.log('\n   O ejecuta este script nuevamente y selecciona un usuario.');
        }
      }
      
      console.log('━'.repeat(70));
      console.log('\n🎉 Migración completada exitosamente\n');
      
      // Preguntar si quiere hacer admin a alguien
      if (usuarios.length > 0) {
        console.log('¿Quieres hacer admin a algún usuario ahora? (s/n)');
        
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        readline.question('Respuesta: ', (respuesta) => {
          if (respuesta.toLowerCase() === 's') {
            readline.question('Ingresa el ID del usuario: ', (id) => {
              db.run(
                'UPDATE usuarios SET rol = ? WHERE id = ?',
                ['admin', id],
                function(err) {
                  if (err) {
                    console.error('❌ Error:', err);
                  } else if (this.changes === 0) {
                    console.log('⚠️  No se encontró un usuario con ese ID');
                  } else {
                    console.log('✅ Usuario actualizado a ADMIN exitosamente');
                  }
                  readline.close();
                  db.close();
                }
              );
            });
          } else {
            readline.close();
            db.close();
          }
        });
      } else {
        db.close();
      }
    });

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    db.close();
    process.exit(1);
  }
}

// Ejecutar
ejecutarMigracion();