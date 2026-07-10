import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getProductById, getProductsByCategory } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import Toast from '../components/ui/Toast';
import { 
  FiArrowLeft, 
  FiShoppingCart, 
  FiHeart, 
  FiShare2, 
  FiStar, 
  FiClock, 
  FiChevronLeft, 
  FiChevronRight,
  FiCheck,
  FiPackage,
  FiAlertCircle
} from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // 🔹 CAMBIO 1: Agregar language al destructuring
  const { t, language } = useLanguage();
  const { addToCart, isInCart, getQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  useEffect(() => {
    loadProduct();
  }, [id]);
  
  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(id);
      setProduct(productData);
      
      const related = await getProductsByCategory(productData.category);
      const filteredRelated = related
        .filter(p => p.id !== productData.id)
        .slice(0, 4);
      setRelatedProducts(filteredRelated);
      
      setError(null);
    } catch (err) {
      setError('Producto no encontrado');
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
  };
  
  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        // 🔹 CAMBIO 2: t('app.lang') → language
        text: language === 'es' ? product.description : (product.descriptionEn || product.description),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage(t('product.linkCopied'));
      setToastShow(true);
    }
  };
  
  const productImages = product ? [product.image] : [];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="animate-pulse bg-gray-200 h-96 rounded-2xl" />
              <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 h-20 flex-1 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="animate-pulse bg-gray-200 h-6 w-24 rounded-full" />
              <div className="animate-pulse bg-gray-200 h-10 w-3/4 rounded" />
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
                <div className="animate-pulse bg-gray-200 h-4 w-5/6 rounded" />
                <div className="animate-pulse bg-gray-200 h-4 w-2/3 rounded" />
              </div>
              <div className="flex gap-6">
                <div className="animate-pulse bg-gray-200 h-5 w-24 rounded" />
                <div className="animate-pulse bg-gray-200 h-5 w-32 rounded" />
              </div>
              <div className="animate-pulse bg-gray-200 h-14 w-40 rounded" />
              <div className="flex gap-4">
                <div className="animate-pulse bg-gray-200 h-12 w-36 rounded-lg" />
                <div className="animate-pulse bg-gray-200 h-12 flex-1 rounded-lg" />
              </div>
              <div className="flex gap-6 pt-4 border-t border-gray-200 dark:border-[#334155]">
                <div className="animate-pulse bg-gray-200 h-8 w-24 rounded" />
                <div className="animate-pulse bg-gray-200 h-8 w-24 rounded" />
                <div className="animate-pulse bg-gray-200 h-8 w-24 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-16">
            <FiAlertCircle className="text-6xl text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              {t('product.notFound')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              {t('product.notFoundDesc')}
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-fuchsia-700"
            >
              <FiArrowLeft />
              {t('product.backToMenu')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const alreadyInCart = isInCart(product.id);
  const quantityInCart = getQuantity(product.id);
  const totalInCart = quantityInCart + quantity;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0f172a] dark:to-[#0f172a] pt-20 pb-16">
      <div className="container mx-auto px-4">
        
        <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-8">
          <Link to="/" className="hover:text-blue-600">{t('product.home')}</Link>
          <span className="mx-2">›</span>
          <Link to="/menu" className="hover:text-blue-600">{t('product.menu')}</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">{product.name}</span>
        </nav>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#1e293b] dark:to-[#0f172a]">
              <div className="relative h-64 md:h-96">
                <img 
                  src={productImages[currentImageIndex]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class=\"w-full h-full flex items-center justify-center text-6xl opacity-30\">🍽️</div>'; }}
                />
                
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-[#334155]"
                    >
                      <FiChevronLeft className="text-xl" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-[#334155]"
                    >
                      <FiChevronRight className="text-xl" />
                    </button>
                  </>
                )}
                
                {product.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-fuchsia-600 to-blue-500 text-white text-xs font-bold rounded-full">
                      {t('featured')}
                    </span>
                  </div>
                )}
              </div>
              
              {productImages.length > 1 && (
                <div className="flex gap-2 p-4">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-1 h-20 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index 
                          ? 'border-blue-500' 
                          : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name}`}
                        onError={(e) => { e.target.style.display = 'none'; }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 dark:border-[#475569] rounded-lg text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600"
              >
                <FiShare2 />
                {t('product.share')}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg text-slate-700 hover:border-red-400 hover:text-red-600">
                <FiHeart />
                {t('product.favorite')}
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                {t(`categories.${product.category}`) || product.category}
              </span>
              <div className="flex items-center gap-1">
                <FiStar className="text-yellow-400 fill-current" />
                <span className="font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">{t('product.reviews', { count: 50 })}</span>
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              {/* 🔹 CAMBIO 3: t('app.lang') → language */}
              {language === 'es' ? product.description : (product.descriptionEn || product.description)}
            </p>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <FiClock />
                <span>{product.prepTime || t('product.prepTimeFallback')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <FiPackage />
                <span>{t('product.stock', { count: product.stock || 10 })}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Bs. {product.price}
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-lg">{t('product.perUnit')}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t('product.taxInfo')}
              </p>
            </div>
            
            <div className="mb-10">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-slate-300 dark:border-[#475569] rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl">-</span>
                  </button>
                    <span className="w-12 text-center text-xl font-bold text-slate-800 dark:text-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock || 10)}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl">+</span>
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={alreadyInCart && totalInCart > (product.stock || 10)}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-lg font-bold text-lg transition-all ${
                    alreadyInCart
                      ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600'
                      : 'bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white hover:from-blue-700 hover:to-fuchsia-700'
                  } disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  <FiShoppingCart className="text-xl" />
                  {alreadyInCart ? (
                    <>
                      <FiCheck />
                      <span>{t('product.addMore', { quantity, totalInCart })}</span>
                    </>
                  ) : (
                    <span>{t('product.addToCart', { total: (product.price * quantity).toFixed(2) })}</span>
                  )}
                </button>
              </div>
              
              {product.stock < 5 && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    ⚠️ {t('product.lowStock', { stock: product.stock })}
                  </p>
                </div>
              )}
              
              {alreadyInCart && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✅ {t('product.inCart', { quantity: quantityInCart })}
                  </p>
                </div>
              )}
            </div>
            
            <div className="border-b border-slate-200 dark:border-[#334155] mb-6">
              <div className="flex gap-6">
                {['description', 'ingredients', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab === 'description' && t('product.tabDescription')}
                    {tab === 'ingredients' && t('product.tabIngredients')}
                    {tab === 'reviews' && t('product.tabReviews')}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="prose max-w-none">
              {activeTab === 'description' && (
                <div>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    {language === 'es' ? product.description : (product.descriptionEn || product.description)}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {t('product.descriptionExtra')}
                  </p>
                </div>
              )}
              
              {activeTab === 'ingredients' && (
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">{t('product.mainIngredients')}</h4>
                  <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-1">
                    {(language === 'es' ? product.ingredients : (product.ingredientsEn || product.ingredients)).split(',').map((item, i) => (
                      <li key={i}>{item.trim()}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                    {t('product.allergens')}
                  </p>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900 dark:text-gray-100">4.8</div>
                      <div className="flex items-center justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar key={star} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('product.reviewCount', { count: 52 })}</p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-slate-600 dark:text-slate-400 w-8">{rating}★</span>
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-[#334155] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400"
                              style={{ width: `${rating * 20}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-500 dark:text-slate-400 w-10">{rating * 10}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-200 dark:border-[#334155] pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                        MJ
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar key={star} className="text-yellow-400 fill-current w-4 h-4" />
                            ))}
                          </div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{t('product.reviewDate')}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{t('product.reviewSample')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-8">
              {t('product.relatedTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-[#475569] rounded-lg text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600"
          >
            <FiArrowLeft />
            {t('product.backToMenu')}
          </button>
        </div>
      </div>
      <Toast message={toastMessage} type="success" show={toastShow} onClose={() => setToastShow(false)} />
    </div>
  );
};

export default ProductDetail;