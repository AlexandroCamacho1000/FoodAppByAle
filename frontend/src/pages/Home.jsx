import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';

export default function Home() {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await getProducts();
        const featured = products.filter(p => p.featured === true);
        setFeaturedProducts(featured);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-fuchsia-50 dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#1e1b2a] animate-gradient py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-fuchsia-200/20 dark:from-blue-500/10 dark:via-transparent dark:to-fuchsia-500/10 pointer-events-none" />
        
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <div className="inline-block mb-6 animate-float">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#2563EB] to-[#D946EF] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                <img src="/logoaledev26.png" alt="AleSoft" className="w-20 h-20 object-contain" />
              </div>
            </div>
            
            <h1 className="animate-slideUp text-4xl md:text-5xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
                {t('home.title')}
              </span>
            </h1>
            
            <p className="animate-fadeIn text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10" style={{ animationDelay: '0.15s' }}>
              {t('home.subtitle')}
            </p>
            
            <Link 
              to="/menu"
              className="animate-fadeIn inline-block bg-gradient-to-r from-blue-700 to-blue-900 text-white px-10 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-900/25 hover:shadow-xl hover:shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all duration-300"
              style={{ animationDelay: '0.3s' }}
            >
              {t('home.cta')}
            </Link>
          </div>
        </div>
      </div>

      {/* Sección Destacados */}
      <div className="container mx-auto px-4 py-16">
        <div className="animate-slideUp flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-extrabold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
                {t('featured')}
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium tracking-wide">
              {t('home.featuredDesc')}
            </p>
          </div>
          <Link 
            to="/menu"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {t('viewAll')}
            <span className="text-lg leading-none">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, i) => (
                <div key={product.id} className="animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <>
                <div className="animate-slideUp" style={{ animationDelay: '0s' }}>
                  <ProductCard product={{ id: '26040d03-8499-4f13-8840-e2ac6a2d92d7', name: 'Sopa de Maní', price: 20, description: 'Sopa cremosa de maní', category: 'sopas', featured: true }} />
                </div>
                <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                  <ProductCard product={{ id: 'e0f321de-e05c-4ebd-8f55-4c5d06ad704e', name: 'Salteña Paceña', price: 12.5, description: 'Deliciosa salteña tradicional', category: 'salteñas', featured: true }} />
                </div>
                <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                  <ProductCard product={{ id: 'dbb6e2f7-883f-4773-b077-ff0989601e40', name: 'Anticuchos', price: 25, description: 'Brochetas de corazón', category: 'carnes', featured: true }} />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}