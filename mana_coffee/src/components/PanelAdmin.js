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

  useEffect(() => {
    if (vista === 'dashboard') {
      cargarDashboard();
    } else if (vista === 'reservas') {
      cargarReservas();
    } else if (vista === 'usuarios') {
      cargarUsuarios();
    }
  }, [vista]);

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
    </div>
  );
}

export default PanelAdmin;