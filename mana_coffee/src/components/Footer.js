import React from 'react';
import LogoBlanco from '../assets/images/logo-blanco.png';
import InstagramIcon from '../assets/images/instagram.png';
import TiktokIcon from '../assets/images/tiktok.png';
import FacebookIcon from '../assets/images/facebook.png';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* SECCIÓN IZQUIERDA - LOGO + BRILLO */}
        <div className="footer-section footer-logo-section">
          <img src={LogoBlanco} alt="Mana Coffee Logo" className="footer-logo" />
          <div className="footer-logo-brillo"></div>

          <p className="footer-text">
            El sabor de la compañía es insuperable.
          </p>
        </div>

        {/* ENLACES */}
        <div className="footer-section">
          <h4 className="footer-subtitle">Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li><a href="/" className="footer-link">Inicio</a></li>
            <li><a href="/arma-tu-almuerzo" className="footer-link">Menú</a></li>
            <li><a href="/contactanos" className="footer-link">Contacto</a></li>
          </ul>
        </div>

        {/* REDES SOCIALES EN COLUMNA */}
        <div className="footer-section footer-social-column">
          <h4 className="footer-subtitle">Síguenos</h4>

          <div className="footer-social-item">
            <img src={InstagramIcon} alt="Instagram" className="footer-social-icon" />
            <span className="footer-social-text">@manacoffee</span>
          </div>

          <div className="footer-social-item">
            <img src={TiktokIcon} alt="TikTok" className="footer-social-icon" />
            <span className="footer-social-text">@manacoffee</span>
          </div>

          <div className="footer-social-item">
            <img src={FacebookIcon} alt="Facebook" className="footer-social-icon" />
            <span className="footer-social-text">Mana Coffee</span>
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
