import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom'; // ← AÑADE ESTE IMPORT

export default function Home() {
  const { t } = useLanguage();

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
        
        {/* CAMBIA ESTE BOTÓN POR UN LINK */}
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
          {/* TAMBIÉN CAMBIA ESTE BOTÓN */}
          <Link 
            to="/menu"
            className="text-[#2563EB] hover:text-[#1D4ED8] font-medium flex items-center gap-2"
          >
            {t('viewAll')}
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </div>
  );
}