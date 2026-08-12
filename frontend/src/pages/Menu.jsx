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

  

 
  const categories = [
    { id: 'all', name: t('viewAll'), count: 0 },
    { id: 'salteñas', name: t('categories.saltenas'), count: 0 },
    { id: 'platos_fuertes', name: t('categories.platosFuertes'), count: 0 },
    { id: 'carnes', name: t('categories.carnes'), count: 0 },
    { id: 'bebidas', name: t('categories.bebidas'), count: 0 },
    { id: 'entradas', name: t('categories.entradas'), count: 0 },
    { id: 'postres', name: t('categories.postres'), count: 0 },
    { id: 'especiales', name: t('categories.especiales'), count: 0 },
  ];


  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);


  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => String(product.category).toLowerCase() === String(selectedCategory).toLowerCase());

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0f172a] dark:to-[#0f172a] pt-20 pb-16">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="animate-slideUp text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">
              {t('menu.title')}
            </span>
          </h1>
          <p className="animate-fadeIn text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto" style={{ animationDelay: '0.15s' }}>
            {t('menu.description')}
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="animate-fadeIn mb-10" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            {t('menu.filterByCategory')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white dark:bg-[#1e293b] border-2 border-slate-200 dark:border-[#334155] text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md hover:shadow-blue-500/10'
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {cat.name} 
                {cat.count > 0 && (
                  <span className={`text-xs ml-1.5 px-2 py-0.5 rounded-full transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-[#334155] text-slate-600 dark:text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State - SKELETON CARDS */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1e293b] rounded-xl shadow-md dark:shadow-black/20 overflow-hidden">
                <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-48 w-full" />
                <div className="p-4 space-y-3">
                  <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-5 w-3/4 rounded" />
                  <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-4 w-1/2 rounded" />
                  <div className="space-y-2">
                    <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-4 w-full rounded" />
                    <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-4 w-2/3 rounded" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-6 w-20 rounded" />
                    <div className="animate-pulse bg-gray-200 dark:bg-[#334155] h-10 w-28 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {selectedCategory !== 'all' && (
              <div className="animate-fadeIn mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {t('menu.categoryLabel')}: {categories.find(c => c.id === selectedCategory)?.name}
                  <span className="text-blue-500 ml-2">
                    ({filteredProducts.length} {t('menu.products')})
                  </span>
                </h2>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div>
                <p className="animate-fadeIn text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {t('menu.showingPage', { current: currentPage, total: totalPages, count: filteredProducts.length })}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {paginatedProducts.map((product, i) => (
                    <div key={product.id} className="animate-slideUp" style={{ animationDelay: `${i * 0.08}s` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn text-center py-16">
                <div className="animate-float text-6xl mb-4">🍽️</div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {t('menu.noProducts')}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  {t('menu.tryAnother')}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-fuchsia-700 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  {t('menu.viewAll')}
                </button>
              </div>
            )}
          </>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="animate-fadeIn flex justify-center items-center gap-2 mt-16" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:shadow-blue-500/10 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
            >
              ← {t('menu.previous')}
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                  currentPage === i + 1
                    ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-white dark:bg-[#1e293b] border-2 border-slate-200 dark:border-[#334155] text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md hover:shadow-blue-500/10'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:shadow-blue-500/10 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
            >
              {t('menu.next')} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}