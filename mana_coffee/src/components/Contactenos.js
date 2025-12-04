import React from 'react';
import './Contactenos.css';

function Contactenos() {
  return (
    <div className="contactenos">
      <div className="contactenos-header">
        <h1 className="contactenos-title">Visita Mana Coffee</h1>
        <p className="contactenos-subtitle">Disfruta del mejor café en Ocaña</p>
      </div>

      <div className="contactenos-content">
        {/* Tarjetas de información */}
        <div className="contactenos-info">
          <div className="contactenos-card">
            <h3 className="contactenos-card-title">📍 Dirección</h3>
            <p className="contactenos-card-text">
              Mana Coffee<br />
              Ocaña, Norte de Santander<br />
              Colombia
            </p>
          </div>

          <div className="contactenos-card">
            <h3 className="contactenos-card-title">🕒 Horario</h3>
            <p className="contactenos-card-text">
              <strong>Lunes a Viernes:</strong><br />
              7:00 AM - 9:00 PM<br /><br />
              <strong>Sábados y Domingos:</strong><br />
              8:00 AM - 10:00 PM
            </p>
          </div>

          <div className="contactenos-card">
            <h3 className="contactenos-card-title">📞 Contacto</h3>
            <p className="contactenos-card-text">
              <strong>Teléfono:</strong><br />
              +57 311 234 5678<br /><br />
              <strong>Email:</strong><br />
              info@manacoffee.com<br /><br />
              <strong>Instagram:</strong><br />
              @manacoffee
            </p>
          </div>
        </div>

        {/* Mapa de Google Maps */}
        <div className="contactenos-mapa-container">
          <h2 className="contactenos-mapa-title">📍 Encuéntranos aquí</h2>
          <div className="contactenos-mapa">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.814802426839!2d-72.64711222642559!3d7.3746432126905725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e688153a8bf1953%3A0xb67c44d64f68830c!2sMana%20coffee!5e0!3m2!1ses!2sco!4v1764868229571!5m2!1ses!2sco"
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '15px' }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Mana Coffee en Google Maps"
            ></iframe>
          </div>
          <a 
            href="https://www.google.com/maps/place/Mana+coffee/@7.3746432,-72.64711222642559,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="contactenos-btn-direcciones"
          >
            🗺️ Abrir en Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contactenos;