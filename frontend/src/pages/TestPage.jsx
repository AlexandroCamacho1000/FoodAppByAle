import { useEffect } from 'react';
import { getProducts, getFeaturedProducts } from '../services/productService';

export default function TestPage() {
  useEffect(() => {
    // Prueba 1: Todos los productos
    getProducts().then(data => {
      console.log('📦 TODOS los productos:', data);
    });
    
    // Prueba 2: Solo destacados  
    getFeaturedProducts().then(data => {
      console.log('⭐ Productos destacados:', data);
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Consola del navegador → F12</h1>
      <p className="text-gray-600">Abre DevTools (F12) y mira la consola</p>
    </div>
  );
}