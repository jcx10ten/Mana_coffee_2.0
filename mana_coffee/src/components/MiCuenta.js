import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MiCuenta.css';
const API_URL = process.env.REACT_APP_API_URL || '';

function MiCuenta() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [reservaEditando, setReservaEditando] = useState(null);
  const navigate = useNavigate();

  // Cargar reservas al montar el componente
  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/iniciar-sesion');
        return;
      }

      const response = await fetch(`${API_URL}/api/reservas/mis-reservas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          navigate('/iniciar-sesion');
          return;
        }
        throw new Error('Error al cargar reservas');
      }

      const data = await response.json();
      
      if (data.reservas && Array.isArray(data.reservas)) {
        setReservas(data.reservas);
      } else if (Array.isArray(data)) {
        setReservas(data);
      } else {
        setReservas([]);
      }
      
    } catch (err) {
      console.error('Error al cargar reservas:', err);
      setError(err.message);
      setReservas([]);
    } finally {
      setCargando(false);
    }
  };

  // Verificar si puede editar (más de 24 horas antes)
  const puedeEditar = (fechaReserva, horaReserva) => {
    const ahora = new Date();
    const fechaHoraReserva = new Date(`${fechaReserva}T${horaReserva}`);
    const diferenciaHoras = (fechaHoraReserva - ahora) / (1000 * 60 * 60);
    return diferenciaHoras > 24;
  };

  // Eliminar reserva
  const eliminarReserva = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reservas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cancelar reserva');
      }

      alert('Reserva cancelada exitosamente');
      cargarReservas();
    } catch (err) {
      alert(err.message);
    }
  };

  // Abrir modal de edición
  const abrirEdicion = (reserva) => {
    setReservaEditando(reserva);
  };

  // Guardar cambios
  const guardarCambios = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reservas/${reservaEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          telefono: reservaEditando.telefono,
          num_personas: reservaEditando.num_personas,
          fecha: reservaEditando.fecha,
          hora: reservaEditando.hora,
          comentarios: reservaEditando.comentarios
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar reserva');
      }

      alert('Reserva actualizada exitosamente');
      setReservaEditando(null);
      cargarReservas();
    } catch (err) {
      alert(err.message);
    }
  };

  if (cargando) {
    return (
      <div className="mi-cuenta-container">
        {/* BRILLITOS DE FONDO */}
        <div className="mi-cuenta-brillos">
          <div className="mi-cuenta-brillo brillo-amarillo brillo-top-right"></div>
          <div className="mi-cuenta-brillo brillo-dorado brillo-mid-left"></div>
          <div className="mi-cuenta-brillo brillo-naranja brillo-bottom-left"></div>
          <div className="mi-cuenta-brillo brillo-rojo brillo-mid-right"></div>
          <div className="mi-cuenta-brillo brillo-rose brillo-bottom-center"></div>
        </div>
        <div className="loading">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="mi-cuenta-container">
      
      {/* BRILLITOS DE FONDO */}
      <div className="mi-cuenta-brillos">
        <div className="mi-cuenta-brillo brillo-amarillo brillo-top-right"></div>
        <div className="mi-cuenta-brillo brillo-dorado brillo-mid-left"></div>
        <div className="mi-cuenta-brillo brillo-naranja brillo-bottom-left"></div>
        <div className="mi-cuenta-brillo brillo-rojo brillo-mid-right"></div>
        <div className="mi-cuenta-brillo brillo-rose brillo-bottom-center"></div>
      </div>

      <div className="mi-cuenta-header">
        <h1>Mis Reservas</h1>
        <button className="btn-nueva-reserva" onClick={() => navigate('/reservar')}>
          + Nueva Reserva
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {reservas.length === 0 ? (
        <div className="sin-reservas">
          <p>No tienes reservas activas</p>
          <button className="btn-reservar-ahora" onClick={() => navigate('/reservar')}>
            Hacer mi primera reserva
          </button>
        </div>
      ) : (
        <div className="reservas-grid">
          {reservas.map((reserva) => {
            const puedeEditarReserva = puedeEditar(reserva.fecha, reserva.hora);
            
            return (
              <div key={reserva.id} className="reserva-card">
                <div className="reserva-card-header">
                  <span className="reserva-id">Reserva #{reserva.id}</span>
                  <span className={`reserva-estado ${reserva.estado}`}>
                    {reserva.estado}
                  </span>
                </div>

                <div className="reserva-card-body">
                  <div className="reserva-info">
                    <span className="reserva-icono">📅</span>
                    <div>
                      <strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString('es-ES')}
                    </div>
                  </div>

                  <div className="reserva-info">
                    <span className="reserva-icono">🕐</span>
                    <div>
                      <strong>Hora:</strong> {reserva.hora}
                    </div>
                  </div>

                  <div className="reserva-info">
                    <span className="reserva-icono">👥</span>
                    <div>
                      <strong>Personas:</strong> {reserva.num_personas}
                    </div>
                  </div>

                  <div className="reserva-info">
                    <span className="reserva-icono">📞</span>
                    <div>
                      <strong>Teléfono:</strong> {reserva.telefono}
                    </div>
                  </div>

                  {reserva.comentarios && (
                    <div className="reserva-comentarios">
                      <strong>Comentarios:</strong>
                      <p>{reserva.comentarios}</p>
                    </div>
                  )}
                </div>

                <div className="reserva-card-footer">
                  {puedeEditarReserva ? (
                    <>
                      <button 
                        className="btn-editar"
                        onClick={() => abrirEdicion(reserva)}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn-cancelar-reserva"
                        onClick={() => eliminarReserva(reserva.id)}
                      >
                        ❌ Cancelar
                      </button>
                    </>
                  ) : (
                    <div className="reserva-no-editable">
                      ⚠️ No se puede modificar (menos de 24h)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de edición */}
      {reservaEditando && (
        <div className="modal-overlay" onClick={() => setReservaEditando(null)}>
          <div className="modal-editar" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Reserva #{reservaEditando.id}</h2>
            
            <form onSubmit={guardarCambios}>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={reservaEditando.telefono}
                  onChange={(e) => setReservaEditando({...reservaEditando, telefono: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Número de personas</label>
                <select
                  value={reservaEditando.num_personas}
                  onChange={(e) => setReservaEditando({...reservaEditando, num_personas: e.target.value})}
                  required
                >
                  {[...Array(42)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1} persona{i > 0 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={reservaEditando.fecha}
                    onChange={(e) => setReservaEditando({...reservaEditando, fecha: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hora</label>
                  <input
                    type="time"
                    value={reservaEditando.hora}
                    onChange={(e) => setReservaEditando({...reservaEditando, hora: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Comentarios</label>
                <textarea
                  value={reservaEditando.comentarios || ''}
                  onChange={(e) => setReservaEditando({...reservaEditando, comentarios: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="btn-cancelar-modal" onClick={() => setReservaEditando(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MiCuenta;