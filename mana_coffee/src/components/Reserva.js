import React, { useState } from 'react';
import './Reserva.css';
import FormularioReserva from './FormularioReserva';

function Reserva() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const abrirFormulario = () => {
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
  };

  return (
    <>
      {/* CONTENIDO DE LA PÁGINA */}
      <div className="reserva-container">
        
        {/* BRILLITOS DE FONDO (igual que Contactenos) */}
        <div className="reserva-brillos">
          <div className="reserva-brillo brillo-amarillo brillo-top-right"></div>
          <div className="reserva-brillo brillo-dorado brillo-mid-left"></div>
          <div className="reserva-brillo brillo-naranja brillo-bottom-left"></div>
          <div className="reserva-brillo brillo-rojo brillo-mid-right"></div>
          <div className="reserva-brillo brillo-rose brillo-bottom-center"></div>
        </div>

        <header className="reserva-header">
          <h1>¡Reserva en Mana Coffee!</h1>
          <p className="reserva-header-subtitle">
            En Mana Coffee tenemos todo lo necesario para que cada evento importante que tengas se vuelva
            inolvidable con nuestro servicio y deliciosa comida. ¡No te lo puedes perder!
          </p>
        </header>

        <section className="reserva-info-section">
          <div className="info-item">
            <span className="info-icon">🕑</span>
            <div className="info-content">
              <h3 className="info-title">Horario:</h3>
              <p className="info-description">
                Abrimos de 8:00 a.m. a 10:00 p.m. de lunes a domingo. 
                Cada reserva tiene una duración de 2 horas máximo.
              </p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">⏰</span>
            <div className="info-content">
              <h3 className="info-title">Llegada puntual:</h3>
              <p className="info-description">
                Tienes 10 minutos de tolerancia. Si llegas después de este tiempo, 
                podrías perder tu reserva.
              </p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">💌</span>
            <div className="info-content">
              <h3 className="info-title">Cancelaciones:</h3>
              <p className="info-description">
                Si no puedes asistir, avísanos con al menos 2 horas de anticipación 
                para que otra persona pueda usar tu mesa.
              </p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">✅</span>
            <div className="info-content">
              <h3 className="info-title">Importante:</h3>
              <p className="info-description">
                Siempre reserva antes de venir. No recibimos grupos sin reserva previa.
              </p>
            </div>
          </div>
        </section>

        <section className="reserva-pasos-section">
          <h2 className="pasos-title">Paso a paso para reservar</h2>
          <ol className="pasos-list">
            <li className="paso-item">
              <span className="paso-numero">1</span>
              <p className="paso-texto">
                Elige el número de personas que asistirán. Tenemos una capacidad para 42 personas.
              </p>
            </li>
            
            <li className="paso-item">
              <span className="paso-numero">2</span>
              <p className="paso-texto">
                Selecciona la fecha y hora de tu preferencia. Si no ves disponibilidad, 
                intenta con otro día.
              </p>
            </li>
            
            <li className="paso-item">
              <span className="paso-numero">3</span>
              <p className="paso-texto">
                Confirma tu información de contacto: nombre, teléfono y correo electrónico.
              </p>
            </li>
            
            <li className="paso-item">
              <span className="paso-numero">4</span>
              <p className="paso-texto">
                Revisa bien antes de confirmar. No podemos cambiar la fecha, hora o número 
                de personas después de confirmar. Si necesitas cambios, deberás cancelar y 
                hacer una nueva reserva.
              </p>
            </li>
            
            <li className="paso-item">
              <span className="paso-numero">5</span>
              <p className="paso-texto">
                Recibirás un correo de confirmación con todos los detalles de tu reserva.
              </p>
            </li>
          </ol>
        </section>

        <section className="reserva-precios-section">
          <h2 className="precios-title">Conoce nuestra experiencia</h2>
          <p className="precios-descripcion">
            En Mana Coffee, cada visita es especial. Ofrecemos café de especialidad, 
            comida preparada con ingredientes frescos y un ambiente perfecto para trabajar, 
            estudiar o compartir con amigos y familia.
          </p>
          <p className="precios-descripcion">
            Nuestro menú incluye opciones vegetarianas, veganas y sin gluten. 
            También contamos con WiFi gratuito y enchufes en todas las mesas.
          </p>
          <p className="precios-nota">
            ** No cobramos cargo por reserva. Solo pagas lo que consumes en el lugar.
          </p>
        </section>

        <section className="reserva-aviso-section">
          <h3 className="aviso-title">Política de privacidad</h3>
          <p className="aviso-texto">
            Al hacer una reserva en Mana Coffee, aceptas que usemos tu información de contacto 
            únicamente para gestionar tu reserva y enviarte recordatorios. No compartimos tus 
            datos con terceros y puedes solicitar su eliminación en cualquier momento 
            escribiendo a <span className="texto-destacado">privacidad@manacoffee.com</span>
          </p>
        </section>

        {/* BOTÓN QUE ABRE EL FORMULARIO */}
        <div className="reserva-cta-container">
          <button 
            className="reserva-btn-principal"
            onClick={abrirFormulario}
          >
            Reserva Ahora
          </button>
        </div>

      </div>
      
      {/* MODAL FUERA DEL CONTAINER - ESTO ES LA CLAVE */}
      {mostrarFormulario && (
        <FormularioReserva cerrarFormulario={cerrarFormulario} />
      )}
    </>
  );
}

export default Reserva;