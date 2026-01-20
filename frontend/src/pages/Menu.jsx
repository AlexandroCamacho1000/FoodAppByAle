import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/product/ProductCard';

export default function Menu() {
  const { t } = useLanguage();

  // Categorías de comida boliviana
  const categories = [
    { id: 1, name: t('categories.saltenas'), count: 8 },
    { id: 2, name: t('categories.anticuchos'), count: 5 },
    { id: 3, name: t('categories.platos'), count: 12 },
    { id: 4, name: 'Sopas y Caldos', count: 6 },
    { id: 5, name: 'Bebidas Tradicionales', count: 7 },
    { id: 6, name: 'Postres', count: 4 },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1E293B] mb-4">
          {t('menu')} <span className="text-[#2563EB]">Completo</span>
        </h1>
        <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
          {t('menu.description')}
        </p>
      </div>

      {/* Filtros por categoría */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-[#1E293B] mb-4">
          {t('menu.filterByCategory')}
        </h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium">
            {t('viewAll')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="px-4 py-2 border border-[#CBD5E1] text-[#475569] rounded-lg hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
            >
              {cat.name} <span className="text-xs ml-1">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <ProductCard key={i} />
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-16">
        <button className="px-4 py-2 border border-[#CBD5E1] text-[#475569] rounded-lg hover:border-[#2563EB]">
          ← {t('menu.previous')}
        </button>
        <span className="px-4 py-2 bg-[#2563EB] text-white rounded-lg">1</span>
        <button className="px-4 py-2 border border-[#CBD5E1] text-[#475569] rounded-lg hover:border-[#2563EB]">
          2
        </button>
        <button className="px-4 py-2 border border-[#CBD5E1] text-[#475569] rounded-lg hover:border-[#2563EB]">
          3
        </button>
        <button className="px-4 py-2 border border-[#CBD5E1] text-[#475569] rounded-lg hover:border-[#2563EB]">
          {t('menu.next')} →
        </button>
      </div>
    </div>
  );
}