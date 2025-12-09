// src/components/InstagramFeed.js
import React, { useState, useEffect } from 'react';
import './InstagramFeed.css';

function InstagramFeed() {
  const [lastUpdate, setLastUpdate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // URL del último post de @mana_coffee_pam
  const INSTAGRAM_POST_URL = 'https://www.instagram.com/p/DRu4BS3Cax3/';

  const loadInstagramEmbed = () => {
    setIsLoading(true);
    
    // Limpiar contenedor
    const container = document.getElementById('instagram-embed-container');
    if (container) {
      container.innerHTML = '';
    }

    // Crear script de Instagram
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    
    // Crear blockquote para Instagram
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.setAttribute('data-instgrm-permalink', INSTAGRAM_POST_URL);
    blockquote.setAttribute('data-instgrm-version', '14');
    blockquote.style.minWidth = '320px';
    blockquote.style.maxWidth = '540px';
    blockquote.style.width = '100%';
    
    if (container) {
      container.appendChild(blockquote);
      container.appendChild(script);
    }

    // Actualizar timestamp
    const now = new Date();
    setLastUpdate(now.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }));
    
    setIsLoading(false);
    localStorage.setItem('instagramLastUpdate', now.getTime());
  };

  useEffect(() => {
    // Cargar al montar
    loadInstagramEmbed();
    
    // Verificar una vez al día
    const interval = setInterval(() => {
      const lastUpdateTime = localStorage.getItem('instagramLastUpdate');
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (!lastUpdateTime || (now - lastUpdateTime) > oneDay) {
        loadInstagramEmbed();
      }
    }, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleManualUpdate = () => {
    loadInstagramEmbed();
  };

  return (
    <div className="instagram-feed-container">
      <div className="instagram-header">
        <h3 className="instagram-feed-title">
          <span className="instagram-icon">📸</span>
          Último Post
        </h3>
        <button 
          onClick={handleManualUpdate}
          className="instagram-refresh-btn"
          disabled={isLoading}
          title="Actualizar post"
        >
          {isLoading ? '⟳' : '⟲'}
        </button>
      </div>
      
      <div id="instagram-embed-container" className="instagram-embed-wrapper">
        {/* Instagram se carga aquí */}
        {isLoading && (
          <div className="instagram-loading">
            <div className="loading-spinner"></div>
            <p>Cargando post de Instagram...</p>
          </div>
        )}
      </div>
      
      <div className="instagram-footer">
        <p className="instagram-handle">@mana_coffee_pam</p>
        {lastUpdate && (
          <p className="instagram-update-info">
            Actualizado: {lastUpdate}
          </p>
        )}
      </div>
    </div>
  );
}

export default InstagramFeed;