import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext'; 
import router from './routes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider> {/* ← AÑADIR ESTE WRAPPER */}
      <RouterProvider router={router} />
    </LanguageProvider>
  </React.StrictMode>
);