import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes importados
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import InstagramFeed from './components/InstagramFeed';  // Instagram a la izquierda
import Menu from './components/Menu';
import ArmaTuAlmuerzo from './components/ArmaTuAlmuerzo';
import Contactenos from './components/Contactenos';
import IniciarSesion from './components/IniciarSesion';
import Footer from './components/Footer';
import Registro from './components/Registro';
import Reserva from './components/Reserva';
import MiCuenta from './components/MiCuenta';
import PanelAdmin from './components/PanelAdmin';

// Componentes de rutas protegidas
import RutaProtegida from './components/RutaProtegida';
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin';

function App() {
  return (
    <Router>
      <div className="app-container">
        
        {/* NAVBAR - Fijo en la parte superior */}
        <Navbar />
        
        {/* CONTENIDO PRINCIPAL */}
        <main className="main-content">
          <Routes>
            
            {/* PÁGINA PRINCIPAL (Inicio) */}
            <Route path="/" element={
              <>
                {/* 1. HERO/CARRUSEL */}
                <Carousel />
                
                {/* 2. SECCIÓN INSTAGRAM + TEXTO */}
                <div className="instagram-section-wrapper">
                  {/* Texto a la izquierda */}
                  <div className="instagram-side-text">
                    <h2>¡Síguenos en Instagram!</h2>
                    <p className="subtitle">Mantente al día con nuestras novedades</p>
                    
                    <div className="text-content">
                      <p>
                        Mantente al tanto de todo lo que ocurre en Mana Restro Bar
                      </p>
                      
                      <p>
                        Disfruta de la mejor experiencia gastronómica y de coctelería en Pamplona, Norte de Santander. Descubre sabores únicos, bebidas artesanales y un ambiente pensado para compartir momentos inolvidables con amigos y familia.
                      </p>
                      
                      <p>
                        No te pierdas nuestras noches temáticas y eventos especiales.
                      </p>
                      
                      <p>
                        Sigue nuestras redes para conocer promociones exclusivas, recetas de nuestros cocteles más icónicos y la historia detrás de cada plato que servimos.
                      </p>
                      
                      <p>
                        Conecta con nuestra comunidad y sé parte de la experiencia Mana Restro Bar.
                      </p>
                      
                      <ul className="instagram-benefits">
                        <li>Descubre nuestros nuevos productos</li>
                        <li>Participa en sorteos exclusivos</li>
                        <li>Conoce historias detrás de cada café</li>
                        <li>Conecta con nuestra comunidad</li>
                      </ul>
                      
                      <a 
                        href="https://www.instagram.com/mana_coffee_pam/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="instagram-follow-btn"
                      >
                        Seguir en Instagram
                      </a>
                    </div>
                  </div>
                  
                  <InstagramFeed />
                </div>
                
                {/* 3. BANNER PARA HACER RESERVAS */}
                <div className="home-menu-banner">
                  <h2>Puedes reservar aquí</h2>
                  <button 
                    className="home-menu-btn"
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      if (token) {
                        window.location.href = '/reservar';
                      } else {
                        window.location.href = '/iniciar-sesion';
                      }
                    }}
                  >
                    Ir a Reservas →
                  </button>
                </div>
              </>
            } />
            
            {/* PÁGINA DE REGISTRO */}
            <Route path="/registro" element={<Registro />} />
            
            {/* PÁGINA DE MENÚ COMPLETO */}
            <Route path="/menu" element={<Menu />} />
            
            {/* CONSTRUYE TU ALMUERZO */}
            <Route path="/arma-tu-almuerzo" element={<ArmaTuAlmuerzo />} />
            
            {/* CONTACTO Y UBICACIÓN */}
            <Route path="/contactanos" element={<Contactenos />} />
            
            {/* INICIAR SESIÓN */}
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            
            {/* ===========================================
                RUTAS PROTEGIDAS (requieren login)
            ============================================ */}
            
            {/* RESERVAR MESA */}
            <Route 
              path="/reservar" 
              element={
                <RutaProtegida>
                  <Reserva />
                </RutaProtegida>
              } 
            />
            
            {/* MI CUENTA - Historial de reservas */}
            <Route 
              path="/mi-cuenta" 
              element={
                <RutaProtegida>
                  <MiCuenta />
                </RutaProtegida>
              } 
            />
            
            {/* PANEL DE ADMINISTRACIÓN (solo admin) */}
            <Route 
              path="/admin" 
              element={
                <RutaProtegidaAdmin>
                  <PanelAdmin />
                </RutaProtegidaAdmin>
              } 
            />
            
            {/* ===========================================
                RUTAS EXTRA (OPCIONALES)
            ============================================ */}
            
            {/* PÁGINA 404 - No encontrada */}
            <Route path="*" element={
              <div className="not-found">
                <h1>404 - Página no encontrada</h1>
                <p>La página que buscas no existe.</p>
                <a href="/" className="back-home-btn">Volver al Inicio</a>
              </div>
            } />
            
          </Routes>
        </main>
        
        {/* FOOTER - Abajo siempre */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;