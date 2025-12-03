import React from 'react';
import './Contactenos.css';

function Contactenos() {
  return (
    <div className="contactenos">
      <h1 className="contactenos-title">Visita Mana Coffee</h1>
      <p className="contactenos-subtitle">Disfruta del mejor café en Ocaña</p>

      <div className="contactenos-grid">
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
    </div>
  );
}

export default Contactenos;