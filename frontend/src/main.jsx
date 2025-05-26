import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx'
import './index.css' // Seu CSS global com Tailwind
import { GenreProvider } from './contexts/GenreContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // Estilos do carrossel
import 'react-quill/dist/quill.snow.css'; // << ESTILOS DO QUILL IMPORTADOS GLOBALMENTE AQUI

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <GenreProvider>
          <App />
        </GenreProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
)