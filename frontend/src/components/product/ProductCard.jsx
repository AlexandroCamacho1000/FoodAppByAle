import { useLanguage } from '../../context/LanguageContext';

export default function ProductCard() {
  const { t } = useLanguage();

  // Datos del producto con traducciones
  const product = {
    name: t('products.saltenas.name'),
    description: t('products.saltenas.description'),
    price: 15,
    category: t('categories.saltenas'),
    rating: 4.8
  };

  return (
    <div className="bg-gradient-to-b from-white to-[#F8FAFC] rounded-xl shadow-lg overflow-hidden border border-[#E2E8F0] hover:shadow-xl hover:border-[#60A5FA]/30 transition-all duration-300">
      <div className="h-48 bg-gradient-to-br from-[#DBEAFE] via-[#F0F9FF] to-[#E0F2FE]"></div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-[#64748B] uppercase tracking-wide">
            {t('category')}: {product.category}
          </span>
          <span className="text-xs bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded">
            ★ {product.rating}
          </span>
        </div>
        
        <h3 className="font-bold text-lg text-[#1E293B] mb-2">
          {product.name}
        </h3>
        <p className="text-[#64748B] text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-[#2563EB]">Bs. {product.price}</span>
            <span className="text-xs text-[#94A3B8] block">{t('price')}</span>
          </div>
          <button className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-4 py-2 rounded-lg hover:from-[#1D4ED8] hover:to-[#1E40AF] transition-all duration-300 font-medium">
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}