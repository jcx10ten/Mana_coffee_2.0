import React, { useState, useEffect } from 'react';
import './FormularioReserva.css';
const API_URL = process.env.REACT_APP_API_URL || '';

function FormularioReserva({ cerrarFormulario }) {
  // ============================================
  // OBTENER DATOS DEL USUARIO LOGUEADO
  // ============================================
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  // ============================================
  // ESTADO DEL FORMULARIO (SIN nombre y email)
  // ============================================
  const [formData, setFormData] = useState({
    telefono: '',
    numPersonas: '',
    fecha: '',
    hora: '',
    comentarios: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ============================================
  // FUNCIÓN: Manejar cambios en los inputs
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // ============================================
  // FUNCIÓN: Validar el formulario
  // ============================================
  const validarFormulario = () => {
    const newErrors = {};

    // Validar teléfono
    const telefonoRegex = /^[0-9]{10}$/;
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!telefonoRegex.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Ingresa un teléfono válido de 10 dígitos';
    }

    // Validar número de personas
    if (!formData.numPersonas) {
      newErrors.numPersonas = 'Selecciona el número de personas';
    } else if (parseInt(formData.numPersonas) > 42) {
      newErrors.numPersonas = 'La capacidad máxima es de 42 personas';
    }

    // Validar fecha
    if (!formData.fecha) {
      newErrors.fecha = 'Selecciona una fecha';
    } else {
      const fechaSeleccionada = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaSeleccionada < hoy) {
        newErrors.fecha = 'La fecha no puede ser anterior a hoy';
      }
    }

    // Validar hora
    if (!formData.hora) {
      newErrors.hora = 'Selecciona una hora';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // FUNCIÓN: Enviar confirmación por WhatsApp
  // ============================================
  const enviarConfirmacionWhatsApp = (reserva) => {
    // Número de WhatsApp de Mana Coffee (CAMBIA ESTE NÚMERO si es necesario)
    const numeroWhatsApp = '573167231002'; // Formato: código país + número sin espacios ni guiones
    
    // Formatear la fecha para que sea más legible
    const fechaFormateada = new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Construir el mensaje
    let mensaje = '📅 *CONFIRMACIÓN DE RESERVA - MANA COFFEE*\n\n';
    mensaje += '✅ Tu reserva ha sido confirmada con los siguientes datos:\n\n';
    mensaje += `👤 *Nombre:* ${usuario?.nombre || 'N/A'}\n`;
    mensaje += `📧 *Email:* ${usuario?.email || 'N/A'}\n`;
    mensaje += `📱 *Teléfono:* ${reserva.telefono}\n`;
    mensaje += `👥 *Número de personas:* ${reserva.num_personas}\n`;
    mensaje += `📆 *Fecha:* ${fechaFormateada}\n`;
    mensaje += `🕐 *Hora:* ${reserva.hora}\n`;
    
    if (reserva.comentarios) {
      mensaje += `\n💬 *Comentarios:*\n${reserva.comentarios}\n`;
    }
    
    mensaje += `\n📍 *Ubicación:* Mana Coffee\n`;
    mensaje += `\n⚠️ *Importante:* Por favor, llega con 10 minutos de anticipación.\n`;
    mensaje += `\n¡Te esperamos! ☕`;
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Abrir WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    window.open(urlWhatsApp, '_blank');
  };

  // ============================================
  // FUNCIÓN: Enviar reserva al backend
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        cerrarFormulario();
        return;
      }

      // Enviar datos al backend
      const response = await fetch(`${API_URL}/api/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          telefono: formData.telefono,
          num_personas: parseInt(formData.numPersonas),
          fecha: formData.fecha,
          hora: formData.hora,
          comentarios: formData.comentarios
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la reserva');
      }

      console.log('Reserva creada:', data);
      setSubmitSuccess(true);

      // ENVIAR CONFIRMACIÓN POR WHATSAPP
      enviarConfirmacionWhatsApp(data.reserva);

      // Cerrar el modal después de 3 segundos
      setTimeout(() => {
        cerrarFormulario();
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al procesar la reserva. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // FUNCIÓN: Cerrar modal al hacer clic fuera
  // ============================================
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      cerrarFormulario();
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        
        <div className="formulario-header">
          <button className="btn-cerrar-modal" onClick={cerrarFormulario}>
            ✕
          </button>
          <h2>Completa tu Reserva</h2>
          {usuario && (
            <p>Reservando como: <strong>{usuario.nombre}</strong> ({usuario.email})</p>
          )}
        </div>

        {submitSuccess ? (
          <div className="formulario-body">
            <div className="success-message">
              <h3>¡Reserva Confirmada! ✓</h3>
              <p>Hemos recibido tu reserva correctamente.</p>
              <p>Te enviaremos un correo de confirmación a <strong>{usuario?.email}</strong></p>
              <p style={{ marginTop: '10px', fontSize: '14px' }}>
                📱 También se abrirá WhatsApp para que confirmes tu reserva directamente con nosotros.
              </p>
              <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                Este mensaje se cerrará automáticamente...
              </p>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="formulario-body">
                
                {isSubmitting && (
                  <div className="loading-message">
                    Procesando tu reserva...
                  </div>
                )}

                {/* CAMPO: TELÉFONO */}
                <div className="form-group">
                  <label htmlFor="telefono">
                    Teléfono de Contacto <span>*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className="form-input"
                    placeholder="3001234567"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                  {errors.telefono && (
                    <span className="error-message">{errors.telefono}</span>
                  )}
                </div>

                {/* CAMPO: NÚMERO DE PERSONAS */}
                <div className="form-group">
                  <label htmlFor="numPersonas">
                    Número de Personas <span>*</span>
                  </label>
                  <select
                    id="numPersonas"
                    name="numPersonas"
                    className="form-select"
                    value={formData.numPersonas}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona...</option>
                    <option value="1">1 persona</option>
                    <option value="2">2 personas</option>
                    <option value="3">3 personas</option>
                    <option value="4">4 personas</option>
                    <option value="5">5 personas</option>
                    <option value="6">6 personas</option>
                    <option value="7">7 personas</option>
                    <option value="8">8 personas</option>
                    <option value="9">9 personas</option>
                    <option value="10">10 personas</option>
                    <option value="15">15 personas</option>
                    <option value="20">20 personas</option>
                    <option value="25">25 personas</option>
                    <option value="30">30 personas</option>
                    <option value="35">35 personas</option>
                    <option value="42">42 personas (máximo)</option>
                  </select>
                  {errors.numPersonas && (
                    <span className="error-message">{errors.numPersonas}</span>
                  )}
                </div>

                {/* FILA: FECHA Y HORA */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fecha">
                      Fecha <span>*</span>
                    </label>
                    <input
                      type="date"
                      id="fecha"
                      name="fecha"
                      className="form-input"
                      value={formData.fecha}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.fecha && (
                      <span className="error-message">{errors.fecha}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="hora">
                      Hora <span>*</span>
                    </label>
                    <input
                      type="time"
                      id="hora"
                      name="hora"
                      className="form-input"
                      value={formData.hora}
                      onChange={handleChange}
                      min="08:00"
                      max="22:00"
                    />
                    {errors.hora && (
                      <span className="error-message">{errors.hora}</span>
                    )}
                  </div>
                </div>

                {/* CAMPO: COMENTARIOS */}
                <div className="form-group">
                  <label htmlFor="comentarios">
                    Comentarios Adicionales (Opcional)
                  </label>
                  <textarea
                    id="comentarios"
                    name="comentarios"
                    className="form-textarea"
                    placeholder="¿Alguna solicitud especial? (Ej: celebración, ubicación preferida, alergias...)"
                    value={formData.comentarios}
                    onChange={handleChange}
                  ></textarea>
                </div>

              </div>

              <div className="formulario-footer">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarFormulario}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-enviar"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

export default FormularioReserva;