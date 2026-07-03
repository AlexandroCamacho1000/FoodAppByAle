import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';
import { getProducts } from '../services/productService';

export default function Menu() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  console.log('🔧 Menu.jsx - Componente renderizado');
  console.log('🌐 VITE_API_URL:', import.meta.env.VITE_API_URL);

  // Categorías de comida boliviana
  const categories = [
    { id: 'all', name: t('viewAll'), count: 0 },
    { id: 'salteñas', name: 'Salteñas', count: 0 },
    { id: 'platos_fuertes', name: 'Platos Fuertes', count: 0 },
    { id: 'carnes', name: 'Carnes', count: 0 },
    { id: 'bebidas', name: 'Bebidas Tradicionales', count: 0 },
    { id: 'entradas', name: 'Entradas y Postres', count: 0 },
  ];

  // Cargar productos
  useEffect(() => {
    console.log('🔄 Menu.jsx - useEffect ejecutado');
    
    const loadProducts = async () => {
      try {
        console.log('📥 Menu.jsx - Iniciando carga de productos...');
        setLoading(true);
        
        const startTime = Date.now();
        const data = await getProducts();
        const endTime = Date.now();
        
        console.log(`✅ Menu.jsx - getProducts() completado en ${endTime - startTime}ms`);
        console.log(`📊 Menu.jsx - Datos recibidos:`, data);
        console.log(`📦 Menu.jsx - Número de productos: ${data.length}`);
        
        if (data.length > 0) {
          console.log('📋 Menu.jsx - Primer producto:', data[0]);
          console.log('📋 Menu.jsx - Categorías encontradas:', [...new Set(data.map(p => p.category))]);
        }
        
        setProducts(data);
        
        const updatedCategories = categories.map(cat => {
          if (cat.id === 'all') {
            return { ...cat, count: data.length };
          }
          const count = data.filter(p => p.category === cat.id).length;
          return { ...cat, count };
        });
        
        console.log('🎯 Menu.jsx - Conteos por categoría:', updatedCategories);
        
      } catch (error) {
        console.error('❌ Menu.jsx - Error cargando productos:', error);
        console.error('🔍 Menu.jsx - Detalles del error:', {
          message: error.message,
          name: error.name,
          response: error.response
        });
      } finally {
        console.log('🏁 Menu.jsx - Finalizando carga');
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filtrar productos por categoría
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  console.log(`🎛️ Menu.jsx - selectedCategory: ${selectedCategory}`);
  console.log(`🎛️ Menu.jsx - filteredProducts: ${filteredProducts.length} productos`);
  console.log(`📄 Menu.jsx - Página ${currentPage} de ${totalPages}`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {t('menu.title')}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('menu.description')}
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {t('menu.filterByCategory')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  console.log(`🎯 Menu.jsx - Cambiando categoría a: ${cat.id}`);
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white shadow-lg'
                    : 'border border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {cat.name} 
                {cat.count > 0 && (
                  <span className="text-xs ml-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State - SKELETON CARDS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="animate-pulse bg-gray-200 h-48 w-full" />
                <div className="p-4 space-y-3">
                  <div className="animate-pulse bg-gray-200 h-5 w-3/4 rounded" />
                  <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded" />
                  <div className="space-y-2">
                    <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
                    <div className="animate-pulse bg-gray-200 h-4 w-2/3 rounded" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="animate-pulse bg-gray-200 h-6 w-20 rounded" />
                    <div className="animate-pulse bg-gray-200 h-10 w-28 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Mostrar categoría seleccionada */}
            {selectedCategory !== 'all' && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Categoría: {categories.find(c => c.id === selectedCategory)?.name}
                  <span className="text-blue-500 ml-2">
                    ({filteredProducts.length} productos)
                  </span>
                </h2>
              </div>
            )}

            {/* Grid de productos */}
            {filteredProducts.length > 0 ? (
              <div>
                <p className="text-sm text-slate-500 mb-4">
                  Mostrando página {currentPage} de {totalPages} ({filteredProducts.length} producto(s))
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-2xl font-bold text-slate-700 mb-2">
                  No hay productos en esta categoría
                </h3>
                <p className="text-slate-500 mb-6">
                  Prueba seleccionando otra categoría
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-fuchsia-700"
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </>
        )}

        {/* Paginación funcional */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← {t('menu.previous')}
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white'
                    : 'border border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('menu.next')} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}