import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  // 🔹 CAMBIO 1: language agregado
  const { t, language } = useLanguage();
  const { addToCart, isInCart, getQuantity } = useCart();

  if (!product) {
    console.warn('⚠️ ProductCard: producto undefined');
    return null;
  }

  if (!product.id) {
    console.warn('⚠️ ProductCard: producto sin ID:', product);
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
    // 🔹 CAMBIO 2: t('app.lang') → language
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
    
    console.log('🛒 Agregando al carrito:', cartItem);
    addToCart(cartItem, 1);
  };

  const alreadyInCart = isInCart(productData.id);
  const quantityInCart = getQuantity(productData.id);

  return (
    <Link 
      to={`/product/${productData.id}`}
      className="block bg-gradient-to-b from-white to-[#F8FAFC] rounded-xl shadow-lg overflow-hidden border border-[#E2E8F0] hover:shadow-xl hover:border-[#60A5FA]/30 transition-all duration-300 group"
    >
      {productData.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-[#D946EF] to-[#A855F7] text-white text-xs px-3 py-1 rounded-full font-medium">
            {t('featured')}
          </span>
        </div>
      )}
      
      <div className="h-48 bg-gradient-to-br from-[#DBEAFE] via-[#F0F9FF] to-[#E0F2FE] overflow-hidden">
        {productData.image && productData.image !== '/images/placeholder.jpg' ? (
          <img 
            src={productData.image} 
            alt={productData.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#64748B] text-sm">{t('product.image') || 'Imagen'}</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-[#64748B] uppercase tracking-wide">
            {t('category')}: {productData.category}
          </span>
          <span className="text-xs bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded">
            ★ {productData.rating}
          </span>
        </div>
        
        <h3 className="font-bold text-lg text-[#1E293B] mb-2 group-hover:text-[#2563EB] transition-colors">
          {productData.name}
        </h3>
        <p className="text-[#64748B] text-sm mb-4 line-clamp-2">
          {productData.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-[#2563EB]">
              Bs. {productData.price.toFixed(2)}
            </span>
            <span className="text-xs text-[#94A3B8] block">{t('price')}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              alreadyInCart
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white hover:from-[#1D4ED8] hover:to-[#1E3A8A]'
            }`}
          >
            {alreadyInCart ? t('addMore') || '+1' : t('addToCart') || 'Comprar'}
          </button>
        </div>
      </div>
    </Link>
  );
}