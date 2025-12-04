import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">☕ Mana Coffee</h3>
          <p className="footer-text">
            El sabor de la compañia es insuperable
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li><a href="/" className="footer-link">Inicio</a></li>
            <li><a href="/arma-tu-almuerzo" className="footer-link">Menú</a></li>
            <li><a href="/contactanos" className="footer-link">Contacto</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Síguenos</h4>
          <div className="footer-social">
            <a href="#" className="footer-social-link">📘</a>
            <a href="#" className="footer-social-link">📷</a>
            <a href="#" className="footer-social-link">🐦</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Mana Coffee. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;