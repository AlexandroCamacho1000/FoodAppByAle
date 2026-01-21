import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';
import { getProducts } from '../services/productService';

export default function Menu() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categorías de comida boliviana
 const categories = [
  { id: 'all', name: t('viewAll'), count: 0 },
  { id: 'Salteñas', name: t('categories.saltenas'), count: 0 },
  { id: 'Carnes', name: t('categories.carnes'), count: 0 },
  { id: 'Platos de Fondo', name: t('categories.platos'), count: 0 },
  { id: 'Bebidas', name: t('categories.bebidastradicionales'), count: 0 },
  { id: 'Entradas', name: t('categories.postresyentradas'), count: 0 },
];

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        
        // Calcular conteos por categoría
        const updatedCategories = categories.map(cat => {
          if (cat.id === 'all') {
            return { ...cat, count: data.length };
          }
          const count = data.filter(p => p.category === cat.id).length;
          return { ...cat, count };
        });
        // Actualizar categorías (opcional, si quieres mostrar conteos reales)
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filtrar productos por categoría
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {t('menu')} <span className="text-blue-600">Completo</span>
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
                onClick={() => setSelectedCategory(cat.id)}
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

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
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
                  onClick={() => setSelectedCategory('all')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-fuchsia-700"
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </>
        )}

        {/* Paginación (si es necesario) */}
        {filteredProducts.length > 8 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 hover:text-blue-600">
              ← {t('menu.previous')}
            </button>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-lg">1</span>
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 hover:text-blue-600">
              2
            </button>
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 hover:text-blue-600">
              3
            </button>
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:border-blue-400 hover:text-blue-600">
              {t('menu.next')} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}