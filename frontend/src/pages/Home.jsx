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
        console.error('Error cargando productos destacados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-block mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#2563EB] to-[#D946EF] rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">🥘</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1E293B]">
          {t('home.title')}
        </h1>
        
        <p className="text-lg text-[#64748B] max-w-2xl mx-auto mb-10">
          {t('home.subtitle')}
        </p>
        
        <Link 
          to="/menu"
          className="inline-block bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-[#2563EB]/30 transition-all font-medium"
        >
          {t('home.cta')}
        </Link>
      </div>

      {/* Sección Destacados */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B]">
              {t('featured')}
            </h2>
            <p className="text-[#64748B]">
              {t('home.featuredDesc')}
            </p>
          </div>
          <Link 
            to="/menu"
            className="text-[#2563EB] hover:text-[#1D4ED8] font-medium flex items-center gap-2"
          >
            {t('viewAll')}
            <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <>
                <ProductCard product={{ id: '26040d03-8499-4f13-8840-e2ac6a2d92d7', name: 'Sopa de Maní', price: 20, description: 'Sopa cremosa de maní', category: 'sopas', featured: true }} />
                <ProductCard product={{ id: 'e0f321de-e05c-4ebd-8f55-4c5d06ad704e', name: 'Salteña Paceña', price: 12.5, description: 'Deliciosa salteña tradicional', category: 'salteñas', featured: true }} />
                <ProductCard product={{ id: 'dbb6e2f7-883f-4773-b077-ff0989601e40', name: 'Anticuchos', price: 25, description: 'Brochetas de corazón', category: 'carnes', featured: true }} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}