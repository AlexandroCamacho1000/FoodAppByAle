import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom'; // AÑADIR ESTE IMPORT

export default function ProductCard({ product }) {
  const { t } = useLanguage();
  const { addToCart, isInCart, getQuantity } = useCart();

  // Función para obtener la clave de traducción basada en el nombre del producto
  const getTranslationKey = (productName) => {
    const keyMap = {
      'Salteñas Paceñas': 'saltenas',
      'Anticuchos': 'anticuchos',
      'Sillpancho Cochabambino': 'silpancho',
      'Pique Macho': 'pique',
      'Api con Pastel': 'api',
      'Humintas': 'humintas'
    };
    
    return keyMap[productName] || 'saltenas'; // fallback a saltenas
  };

  // Función para obtener categoría traducida - CORREGIDA
  const getTranslatedCategory = (category) => {
    // Mapeo exacto de categorías a claves de traducción
    const categoryMap = {
      'Salteñas': 'saltenas',
      'Carnes': 'carnes',
      'Platos de Fondo': 'platos',  // ← Clave corregida
      'Bebidas': 'bebidas',
      'Entradas': 'entradas'
    };
    
    const key = categoryMap[category];
    
    // Si encontramos la clave, usar traducción
    if (key) {
      const translated = t(`categories.${key}`);
      // Si la traducción existe y no es la clave misma, usarla
      if (translated && translated !== `categories.${key}`) {
        return translated;
      }
    }
    
    // Si no hay traducción, devolver la categoría original
    return category;
  };

  // Obtener datos del producto con traducciones
  const getProductData = () => {
    if (!product) {
      return {
        id: 1,
        name: t('products.saltenas.name'),
        description: t('products.saltenas.description'),
        price: 15,
        category: t('categories.saltenas'),
        image: '/images/saltenas.jpg',
        featured: true,
        rating: 4.8
      };
    }
    
    const translationKey = getTranslationKey(product.name);
    
    return {
      ...product,
      name: t(`products.${translationKey}.name`) || product.name,
      description: t(`products.${translationKey}.description`) || product.description,
      category: getTranslatedCategory(product.category)  // ← Usar función corregida
    };
  };

  const productData = getProductData();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevenir que el click se propague al Link
    e.stopPropagation(); // Detener la propagación
    console.log('🖱️ Click en añadir:', productData.name);
    addToCart(productData, 1);
  };

  const alreadyInCart = isInCart(productData.id);
  const quantityInCart = getQuantity(productData.id);

  return (
    <Link 
      to={`/product/${productData.id}`}
      className="block bg-gradient-to-b from-white to-[#F8FAFC] rounded-xl shadow-lg overflow-hidden border border-[#E2E8F0] hover:shadow-xl hover:border-[#60A5FA]/30 transition-all duration-300 group"
    >
      {/* Badge destacado */}
      {productData.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-[#D946EF] to-[#A855F7] text-white text-xs px-3 py-1 rounded-full font-medium">
            {t('featured')}
          </span>
        </div>
      )}
      
      {/* Imagen - Usar imagen real si existe */}
      <div className="h-48 bg-gradient-to-br from-[#DBEAFE] via-[#F0F9FF] to-[#E0F2FE] overflow-hidden">
        {productData.image && productData.image !== '/images/saltenas.jpg' ? (
          <img 
            src={productData.image} 
            alt={productData.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#64748B] text-sm">Imagen del producto</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Categoría y rating */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-medium text-[#64748B] uppercase tracking-wide">
            {t('category')}: {productData.category}
          </span>
          <span className="text-xs bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded">
            ★ {productData.rating || 4.5}
          </span>
        </div>
        
        {/* Nombre y descripción */}
        <h3 className="font-bold text-lg text-[#1E293B] mb-2 group-hover:text-[#2563EB] transition-colors">
          {productData.name}
        </h3>
        <p className="text-[#64748B] text-sm mb-4 line-clamp-2">
          {productData.description}
        </p>
        
        {/* Precio y botón */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-[#2563EB]">
              Bs. {productData.price}
            </span>
            <span className="text-xs text-[#94A3B8] block">{t('price')}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              alreadyInCart
                ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white'
                : 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white hover:from-[#1D4ED8] hover:to-[#1E40AF]'
            }`}
          >
            {alreadyInCart ? `✓ ${quantityInCart}` : t('addToCart')}
          </button>
        </div>
        
        {/* Indicador si ya está en carrito */}
        {alreadyInCart && (
          <div className="mt-3 text-xs text-[#10B981] font-medium text-center">
            ✅ {t('cart.alreadyInCart')}
          </div>
        )}
      </div>
    </Link>
  );
}