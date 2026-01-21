import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext'; 
import { CartProvider } from './context/CartContext'; // ← AÑADIR
import router from './routes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <CartProvider> {/* ← ENVOLVER CON CartProvider */}
        <RouterProvider router={router} />
      </CartProvider>
    </LanguageProvider>
  </React.StrictMode>
);