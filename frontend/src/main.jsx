// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext'; 
import { AuthProvider } from './context/AuthContext'; // ✅ NUEVO
import { CartProvider } from './context/CartContext';
import router from './routes/index';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider> {/* ✅ AQUÍ ENVOLVEMOS CON AuthProvider */}
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);