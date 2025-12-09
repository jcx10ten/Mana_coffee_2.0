import React, { useState, useEffect } from 'react';
import './PanelAdmin.css';

function PanelAdmin() {
  const [vista, setVista] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  
  // Estados para filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Estado para editar reserva
  const [reservaEditar, setReservaEditar] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  // ✅ NUEVO: Estados para actualizar menú
  const [mostrarModalMenu, setMostrarModalMenu] = useState(false);
  const [archivoMenu, setArchivoMenu] = useState(null);
  const [subiendoMenu, setSubiendoMenu] = useState(false);
  const [menuActual, setMenuActual] = useState(null);

  useEffect(() => {
    if (vista === 'dashboard') {
      cargarDashboard();
    } else if (vista === 'reservas') {
      cargarReservas();
    } else if (vista === 'usuarios') {
      cargarUsuarios();
    }
  }, [vista]);

  // ✅ NUEVO: Cargar menú actual al montar
  useEffect(() => {
    cargarMenuActual();
  }, []);

  // ============================================
  // ✅ NUEVO: CARGAR MENÚ ACTUAL
  // ============================================
  const cargarMenuActual = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/menu/actual', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al cargar menú');

      const data = await response.json();
      setMenuActual(data.menu);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // ============================================
  // ✅ NUEVO: SUBIR NUEVO MENÚ
  // ============================================
  const subirNuevoMenu = async (e) => {
    e.preventDefault();
    
    if (!archivoMenu) {
      alert('Por favor selecciona un archivo PDF');
      return;
    }

    // Validar que sea PDF
    if (archivoMenu.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      return;
    }

    // Validar tamaño (50MB máximo)
    if (archivoMenu.size > 50 * 1024 * 1024) {
      alert('El archivo es muy grande. Máximo 50MB');
      return;
    }

    setSubiendoMenu(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('menu', archivoMenu);

      const response = await fetch('http://localhost:5000/api/menu/subir', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Error al subir menú');

      const data = await response.json();
      alert('✅ ' + data.mensaje);
      
      setMostrarModalMenu(false);
      setArchivoMenu(null);
      cargarMenuActual();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir el menú');
    } finally {
      setSubiendoMenu(false);
    }
  };

  // ============================================
  // CARGAR DASHBOARD
  // ============================================
  const cargarDashboard = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al cargar dashboard');

      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el dashboard');
    } finally {
      setCargando(false);
    }
  };

  // ============================================
  // CARGAR RESERVAS
  // ============================================
  const cargarReservas = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filtroFecha) params.append('fecha', filtroFecha);
      if (filtroEstado) params.append('estado', filtroEstado);
      if (busqueda) params.append('buscar', busqueda);

      const response = await fetch(
        `http://localhost:5000/api/admin/reservas?${params.toString()}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error('Error al cargar reservas');

      const data = await response.json();
      setReservas(data.reservas);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar las reservas');
    } finally {
      setCargando(false);
    }
  };

  // ============================================
  // CARGAR USUARIOS
  // ============================================
  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al cargar usuarios');

      const data = await response.json();
      setUsuarios(data.usuarios);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar los usuarios');
    } finally {
      setCargando(false);
    }
  };

  // ============================================
  // ELIMINAR RESERVA
  // ============================================
  const eliminarReserva = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/reservas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al eliminar');

      alert('Reserva eliminada exitosamente');
      cargarReservas();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la reserva');
    }
  };

  // ============================================
  // CAMBIAR ESTADO DE RESERVA
  // ============================================
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reservas/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) throw new Error('Error al cambiar estado');

      alert('Estado actualizado exitosamente');
      cargarReservas();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el estado');
    }
  };

  // ============================================
  // ABRIR MODAL EDITAR
  // ============================================
  const abrirModalEditar = (reserva) => {
    setReservaEditar({
      ...reserva,
      fecha: reserva.fecha.split('T')[0]
    });
    setMostrarModalEditar(true);
  };

  // ============================================
  // GUARDAR EDICIÓN
  // ============================================
  const guardarEdicion = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/admin/reservas/${reservaEditar.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            telefono: reservaEditar.telefono,
            num_personas: parseInt(reservaEditar.num_personas),
            fecha: reservaEditar.fecha,
            hora: reservaEditar.hora,
            estado: reservaEditar.estado,
            comentarios: reservaEditar.comentarios
          })
        }
      );

      if (!response.ok) throw new Error('Error al actualizar');

      alert('Reserva actualizada exitosamente');
      setMostrarModalEditar(false);
      cargarReservas();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar la reserva');
    }
  };

  // ============================================
  // CAMBIAR ROL DE USUARIO
  // ============================================
  const cambiarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === 'admin' ? 'cliente' : 'admin';
    if (!window.confirm(`¿Cambiar rol a: ${nuevoRol}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/admin/usuarios/${id}/rol`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ rol: nuevoRol })
        }
      );

      if (!response.ok) throw new Error('Error al cambiar rol');

      alert('Rol actualizado exitosamente');
      cargarUsuarios();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el rol');
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================
  return (
    <div className="panel-admin">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>☕ Panel Admin</h2>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={vista === 'dashboard' ? 'active' : ''}
            onClick={() => setVista('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={vista === 'reservas' ? 'active' : ''}
            onClick={() => setVista('reservas')}
          >
            📅 Reservas
          </button>
          <button 
            className={vista === 'usuarios' ? 'active' : ''}
            onClick={() => setVista('usuarios')}
          >
            👥 Usuarios
          </button>

          {/* ✅ NUEVO: BOTÓN PARA ACTUALIZAR MENÚ */}
          <button 
            className="admin-menu-btn"
            onClick={() => setMostrarModalMenu(true)}
          >
            📄 Actualizar Menú
          </button>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {vista === 'dashboard' && '📊 Dashboard'}
            {vista === 'reservas' && '📅 Gestión de Reservas'}
            {vista === 'usuarios' && '👥 Gestión de Usuarios'}
          </h1>

          {/* ✅ NUEVO: Info del menú actual */}
          {menuActual && (
            <div className="menu-actual-info">
              <span className="menu-actual-badge">
                📄 Menú actualizado: {new Date(menuActual.fecha_subida).toLocaleDateString('es-CO')}
              </span>
            </div>
          )}
        </header>

        <div className="admin-content">
          {cargando && <div className="loading">Cargando...</div>}

          {/* ========== VISTA: DASHBOARD ========== */}
          {vista === 'dashboard' && dashboard && (
            <div className="dashboard-grid">
              <div className="stat-card">
                <h3>Reservas Hoy</h3>
                <p className="stat-number">{dashboard.totalReservasHoy}</p>
              </div>
              <div className="stat-card">
                <h3>Próxima Semana</h3>
                <p className="stat-number">{dashboard.totalReservasSemana}</p>
              </div>
              <div className="stat-card">
                <h3>Total Usuarios</h3>
                <p className="stat-number">{dashboard.totalUsuarios}</p>
              </div>

              <div className="recent-reservations">
                <h3>Reservas Recientes</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Personas</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.reservasRecientes.map(r => (
                      <tr key={r.id}>
                        <td>{r.nombre}</td>
                        <td>{new Date(r.fecha).toLocaleDateString('es-CO')}</td>
                        <td>{r.hora}</td>
                        <td>{r.num_personas}</td>
                        <td>
                          <span className={`badge badge-${r.estado}`}>
                            {r.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== VISTA: RESERVAS ========== */}
          {vista === 'reservas' && (
            <>
              <div className="filters-bar">
                <input
                  type="date"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                  placeholder="Filtrar por fecha"
                />
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="completada">Completada</option>
                </select>
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <button onClick={cargarReservas} className="btn-filtrar">
                  🔍 Buscar
                </button>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Personas</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map(r => (
                      <tr key={r.id}>
                        <td>#{r.id}</td>
                        <td>{r.nombre}</td>
                        <td>{r.email}</td>
                        <td>{r.telefono}</td>
                        <td>{new Date(r.fecha).toLocaleDateString('es-CO')}</td>
                        <td>{r.hora}</td>
                        <td>{r.num_personas}</td>
                        <td>
                          <select
                            value={r.estado}
                            onChange={(e) => cambiarEstado(r.id, e.target.value)}
                            className="estado-select"
                          >
                            <option value="confirmada">Confirmada</option>
                            <option value="cancelada">Cancelada</option>
                            <option value="completada">Completada</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => abrirModalEditar(r)}
                            className="btn-editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => eliminarReserva(r.id)}
                            className="btn-eliminar"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ========== VISTA: USUARIOS ========== */}
          {vista === 'usuarios' && (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge badge-${u.rol}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td>{new Date(u.fecha_registro).toLocaleDateString('es-CO')}</td>
                      <td>
                        <button
                          onClick={() => cambiarRol(u.id, u.rol)}
                          className="btn-cambiar-rol"
                        >
                          {u.rol === 'admin' ? '👤 Hacer Cliente' : '⭐ Hacer Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ========== MODAL EDITAR RESERVA ========== */}
      {mostrarModalEditar && (
        <div className="modal-overlay" onClick={() => setMostrarModalEditar(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Reserva #{reservaEditar.id}</h2>
              <button onClick={() => setMostrarModalEditar(false)}>✕</button>
            </div>
            <form onSubmit={guardarEdicion} className="modal-form">
              <label>
                Teléfono:
                <input
                  type="tel"
                  value={reservaEditar.telefono}
                  onChange={(e) => setReservaEditar({...reservaEditar, telefono: e.target.value})}
                  required
                />
              </label>
              <label>
                Personas:
                <input
                  type="number"
                  min="1"
                  max="42"
                  value={reservaEditar.num_personas}
                  onChange={(e) => setReservaEditar({...reservaEditar, num_personas: e.target.value})}
                  required
                />
              </label>
              <label>
                Fecha:
                <input
                  type="date"
                  value={reservaEditar.fecha}
                  onChange={(e) => setReservaEditar({...reservaEditar, fecha: e.target.value})}
                  required
                />
              </label>
              <label>
                Hora:
                <input
                  type="time"
                  value={reservaEditar.hora}
                  onChange={(e) => setReservaEditar({...reservaEditar, hora: e.target.value})}
                  required
                />
              </label>
              <label>
                Estado:
                <select
                  value={reservaEditar.estado}
                  onChange={(e) => setReservaEditar({...reservaEditar, estado: e.target.value})}
                >
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="completada">Completada</option>
                </select>
              </label>
              <label>
                Comentarios:
                <textarea
                  value={reservaEditar.comentarios}
                  onChange={(e) => setReservaEditar({...reservaEditar, comentarios: e.target.value})}
                  rows="3"
                ></textarea>
              </label>
              <div className="modal-actions">
                <button type="button" onClick={() => setMostrarModalEditar(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  💾 Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== ✅ NUEVO: MODAL ACTUALIZAR MENÚ ========== */}
      {mostrarModalMenu && (
        <div className="modal-overlay" onClick={() => setMostrarModalMenu(false)}>
          <div className="modal-container modal-menu" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📄 Actualizar Menú</h2>
              <button onClick={() => setMostrarModalMenu(false)}>✕</button>
            </div>

            <div className="modal-form">
              <div className="menu-upload-info">
                <p className="info-text">
                  <strong>ℹ️ Importante:</strong> Al subir un nuevo PDF del menú, 
                  el anterior será reemplazado automáticamente para mantener el sitio limpio.
                </p>
                
                {menuActual && (
                  <div className="menu-actual-preview">
                    <p><strong>Menú actual:</strong></p>
                    <p>📅 Subido: {new Date(menuActual.fecha_subida).toLocaleDateString('es-CO')}</p>
                    <p>📄 Archivo: {menuActual.nombre_archivo}</p>
                  </div>
                )}
              </div>

              <form onSubmit={subirNuevoMenu} className="upload-form">
                <div className="file-input-wrapper">
                  <label className="file-input-label">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setArchivoMenu(e.target.files[0])}
                      className="file-input"
                    />
                    <span className="file-input-button">
                      {archivoMenu ? '✅ ' + archivoMenu.name : '📁 Seleccionar PDF'}
                    </span>
                  </label>
                  
                  {archivoMenu && (
                    <div className="file-info">
                      <p>Tamaño: {(archivoMenu.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>

                <div className="upload-requirements">
                  <p>✓ Solo archivos PDF</p>
                  <p>✓ Tamaño máximo: 50MB</p>
                  <p>✓ El archivo anterior será eliminado</p>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={() => setMostrarModalMenu(false)}
                    disabled={subiendoMenu}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-guardar"
                    disabled={!archivoMenu || subiendoMenu}
                  >
                    {subiendoMenu ? '⏳ Subiendo...' : '📤 Subir Menú'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelAdmin;