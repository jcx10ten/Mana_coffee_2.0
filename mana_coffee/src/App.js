import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Menu from './components/Menu';
import ArmaTuAlmuerzo from './components/ArmaTuAlmuerzo';
import Contactenos from './components/Contactenos';
import IniciarSesion from './components/IniciarSesion';
import Footer from './components/Footer';
import Registro from './components/Registro';
import Reserva from './components/Reserva';
import MiCuenta from './components/MiCuenta';
import RutaProtegida from './components/RutaProtegida';
import PanelAdmin from './components/PanelAdmin';
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/registro" element={<Registro />} />
            
            {/* ✅ PÁGINA PRINCIPAL - SOLO CARRUSEL */}
            <Route path="/" element={<Carousel />} />
            
            {/* ✅ MENÚ EN PÁGINA SEPARADA */}
            <Route path="/menu" element={<Menu />} />
            
            <Route path="/arma-tu-almuerzo" element={<ArmaTuAlmuerzo />} />
            <Route path="/contactanos" element={<Contactenos />} />
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            
            {/* RUTAS PROTEGIDAS */}
            <Route 
              path="/reservar" 
              element={
                <RutaProtegida>
                  <Reserva />
                </RutaProtegida>
              } 
            />
            <Route 
              path="/mi-cuenta" 
              element={
                <RutaProtegida>
                  <MiCuenta />
                </RutaProtegida>
              } 
            />
            <Route 
  path="/admin" 
  element={
    <RutaProtegidaAdmin>
      <PanelAdmin />
    </RutaProtegidaAdmin>
  } 
/>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;