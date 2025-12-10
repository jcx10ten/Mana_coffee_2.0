import React from 'react';
import './Contactenos.css';
import logoDorado from '../assets/images/logo-dorado.png';

function Contactenos() {
  return (
    <div className="contactenos">

      {/* Brillitos de fondo */}
      <div className="contactenos-brillos">
        <div className="contactenos-brillo brillo-amarillo brillo-top-right"></div>
        <div className="contactenos-brillo brillo-dorado brillo-mid-left"></div>
        <div className="contactenos-brillo brillo-naranja brillo-bottom-left"></div>
        <div className="contactenos-brillo brillo-rojo brillo-mid-right"></div>
        <div className="contactenos-brillo brillo-rose brillo-bottom-center"></div>
      </div>

      {/* HEADER */}
      <div className="contactenos-header">
        <h2 className="contactenos-visita">VISITA</h2>
        <img src={logoDorado} alt="Mana" className="contactenos-logo" />
        <p className="contactenos-restobar">RESTOBAR</p>
        <p className="contactenos-subtitle">Disfruta el mejor café en Ocaña.</p>
      </div>

      {/* TARJETAS */}
      <div className="contactenos-cards">

        <div className="contactenos-card">
          <h3 className="contactenos-card-title">Dirección</h3>
          <div className="contactenos-card-content">
            <p>Mana Coffee</p>
            <p>Ocaña, Norte de Santander</p>
            <p>Colombia</p>
          </div>
        </div>

        <div className="contactenos-card">
          <h3 className="contactenos-card-title">Horario</h3>
          <div className="contactenos-card-content">
            <p><strong>Lunes a Viernes:</strong></p>
            <p>7:00 AM - 9:00 PM</p>
            <br />
            <p><strong>Sábados y Domingos:</strong></p>
            <p>8:00 AM - 10:00 PM</p>
          </div>
        </div>

        <div className="contactenos-card">
          <h3 className="contactenos-card-title">Contacto</h3>
          <div className="contactenos-card-content">
            <p><strong>Teléfono:</strong></p>
            <p>+57 311 234 5678</p>
            <br />
            <p><strong>Email:</strong></p>
            <p>info@manacoffee.com</p>
            <br />
            <p><strong>Instagram:</strong></p>
            <p>@manacoffee</p>
          </div>
        </div>

      </div>

      {/* MAPA */}
      <div className="contactenos-mapa-section">
        <h2 className="contactenos-mapa-title">📍 Encuéntranos aquí</h2>

        <div className="contactenos-mapa-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.814802426839!2d-72.64711222642559!3d7.3746432126905725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e688153a8bf1953%3A0xb67c44d64f68830c!2sMana%20coffee!5e0!3m2!1ses!2sco!4v1764868229571!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Mana Coffee en Google Maps"
          ></iframe>
        </div>

        <a
          href="https://www.google.com/maps/place/Mana+coffee/"
          target="_blank"
          rel="noopener noreferrer"
          className="contactenos-btn-mapa"
        >
          🗺️ Abrir en Google Maps
        </a>
      </div>

    </div>
  );
}

export default Contactenos;
