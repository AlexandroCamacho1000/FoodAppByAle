import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { t, language } = useLanguage();
  const { addToCart, isInCart, getQuantity } = useCart();

  if (!product) {
    return null;
  }

  if (!product.id) {
    return null;
  }

  const getTranslationKey = (productName) => {
    if (!productName) return 'unknown';
    const keyMap = {
      'Sopa de Maní': 'sopa_mani',
      'Salteña Paceña': 'saltena',
      'Anticuchos': 'anticuchos',
      'Sillpancho Cochabambino': 'silpancho',
      'Pique Macho': 'pique',
      'Api con Pastel': 'api',
      'Humintas': 'humintas'
    };
    return keyMap[productName] || productName.toLowerCase().replace(/ /g, '_');
  };

  const getTranslatedCategory = (category) => {
    if (!category) return t('categories.unknown') || 'Categoría';
    
    const categoryMap = {
      'salteñas': 'saltenas',
      'platos_fuertes': 'platos_fuertes',
      'carnes': 'carnes',
      'bebidas': 'bebidas',
      'entradas': 'entradas',
      'sopas': 'sopas'
    };
    
    const key = categoryMap[category] || category;
    const translated = t(`categories.${key}`);
    
    if (translated && translated !== `categories.${key}`) {
      return translated;
    }
    
    const categoryNames = {
      'salteñas': 'Salteñas',
      'platos_fuertes': 'Platos Fuertes',
      'carnes': 'Carnes',
      'bebidas': 'Bebidas',
      'entradas': 'Entradas',
      'sopas': 'Sopas'
    };
    
    return categoryNames[category] || category;
  };

  const productData = {
    id: product.id,
    name: product.name || 'Producto',
    description: language === 'es' ? (product.description || '') : (product.descriptionEn || product.description || ''),
    price: parseFloat(product.price) || 0,
    category: getTranslatedCategory(product.category),
    image: product.image || '/images/placeholder.jpg',
    featured: product.featured || false,
    rating: product.rating || 4.5,
    translationKey: getTranslationKey(product.name)
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = {
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.image
    };
    
    addToCart(cartItem, 1);
  };

  const alreadyInCart = isInCart(productData.id);
  const quantityInCart = getQuantity(productData.id);

  return (
    <Link 
      to={`/product/${productData.id}`}
      className="block bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 dark:border-[#334155] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] hover:border-blue-200/50 dark:hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-1"
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1e293b] dark:to-[#0f172a]">
          {productData.image && productData.image !== '/images/placeholder.jpg' ? (
            <img 
              src={productData.image} 
              alt={productData.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-30">🍽️</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {productData.featured && (
              <span className="backdrop-blur-md bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg">
                {t('featured')}
              </span>
            )}
              <span className="backdrop-blur-md bg-white/80 dark:bg-[#1e293b]/80 text-gray-700 dark:text-gray-300 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {productData.category}
            </span>
          </div>
          
          <div className="absolute bottom-3 right-3">
            <span className="backdrop-blur-md bg-white/90 dark:bg-[#1e293b]/90 text-gray-700 dark:text-gray-300 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              ★ {productData.rating}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {productData.name}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
          {productData.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[10px] font-medium text-gray-400">Bs</span>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {productData.price.toFixed(2)}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
              alreadyInCart
                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md'
            }`}
          >
            {alreadyInCart ? t('product.addMore') || '+1' : t('addToCart') || 'Comprar'}
          </button>
        </div>
      </div>
    </Link>
  );
}