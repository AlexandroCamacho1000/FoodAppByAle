import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getProductById, getProductsByCategory } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
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
  const { t } = useLanguage();
  const { addToCart, isInCart, getQuantity } = useCart(); // ← CAMBIADO A getQuantity
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    loadProduct();
  }, [id]);
  
  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProductById(id);
      setProduct(productData);
      
      // Cargar productos relacionados
      const related = await getProductsByCategory(productData.category);
      const filteredRelated = related
        .filter(p => p.id !== productData.id)
        .slice(0, 4);
      setRelatedProducts(filteredRelated);
      
      setError(null);
    } catch (err) {
      setError('Producto no encontrado');
      console.error('Error loading product:', err);
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
    
    const result = await addToCart(product, quantity);
    if (result.success) {
      // Feedback visual (podría ser un toast)
      console.log(`✅ ${product.name} x${quantity} agregado al carrito`);
    }
  };
  
  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Copiar URL al clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };
  
  // Simular imágenes múltiples
  const productImages = product ? [
    product.image,
    '/images/food-detail-1.jpg',
    '/images/food-detail-2.jpg',
    '/images/food-detail-3.jpg'
  ] : [];
  
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Producto no encontrado
            </h2>
            <p className="text-slate-600 mb-8">
              El producto que buscas no existe o ha sido removido.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-fuchsia-700"
            >
              <FiArrowLeft />
              Volver al menú
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const alreadyInCart = isInCart(product.id);
  const quantityInCart = getQuantity(product.id); // ← CAMBIADO A getQuantity
  const totalInCart = quantityInCart + quantity;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-16">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-blue-600">Inicio</Link>
          <span className="mx-2">›</span>
          <Link to="/menu" className="hover:text-blue-600">Menú</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-800 font-medium">{product.name}</span>
        </nav>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Columna izquierda - Imágenes */}
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
              {/* Imagen principal */}
              <div className="relative h-96">
                <img 
                  src={productImages[currentImageIndex]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Controles del carrusel */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-800 hover:bg-white"
                    >
                      <FiChevronLeft className="text-xl" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-800 hover:bg-white"
                    >
                      <FiChevronRight className="text-xl" />
                    </button>
                  </>
                )}
                
                {/* Badge destacado */}
                {product.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-fuchsia-600 to-blue-500 text-white text-xs font-bold rounded-full">
                      {t('featured')}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Miniaturas */}
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
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg text-slate-700 hover:border-blue-400 hover:text-blue-600"
              >
                <FiShare2 />
                Compartir
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg text-slate-700 hover:border-red-400 hover:text-red-600">
                <FiHeart />
                Favorito
              </button>
            </div>
          </div>
          
          {/* Columna derecha - Información */}
          <div className="lg:w-1/2">
            {/* Categoría y rating */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <FiStar className="text-yellow-400 fill-current" />
                <span className="font-bold text-slate-800">{product.rating}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 text-sm">50+ reviews</span>
              </div>
            </div>
            
            {/* Nombre y descripción corta */}
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              {product.description}
            </p>
            
            {/* Info adicional */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-slate-600">
                <FiClock />
                <span>{product.prepTime || '15-30 min'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <FiPackage />
                <span>Stock: {product.stock || 10} unidades</span>
              </div>
            </div>
            
            {/* Precio */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Bs. {product.price}
                </span>
                <span className="text-slate-400 text-lg">por unidad</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Precio final incluye IVA (13%)
              </p>
            </div>
            
            {/* Selector de cantidad y botón */}
            <div className="mb-10">
              <div className="flex items-center gap-6">
                {/* Selector de cantidad */}
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl">-</span>
                  </button>
                  <span className="w-12 text-center text-xl font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock || 10)}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-2xl">+</span>
                  </button>
                </div>
                
                {/* Botón agregar al carrito */}
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
                      <span>Agregar {quantity} más ({totalInCart} en total)</span>
                    </>
                  ) : (
                    <span>Agregar al Carrito - Bs. {product.price * quantity}</span>
                  )}
                </button>
              </div>
              
              {/* Mensaje de stock */}
              {product.stock < 5 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    ⚠️ ¡Quedan solo {product.stock} unidades! Pedido limitado.
                  </p>
                </div>
              )}
              
              {/* Mensaje si ya está en carrito */}
              {alreadyInCart && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Ya tienes {quantityInCart} unidad(es) en tu carrito.
                  </p>
                </div>
              )}
            </div>
            
            {/* Tabs de información */}
            <div className="border-b border-slate-200 mb-6">
              <div className="flex gap-6">
                {['description', 'ingredients', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {tab === 'description' && 'Descripción'}
                    {tab === 'ingredients' && 'Ingredientes'}
                    {tab === 'reviews' && 'Reseñas'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Contenido de tabs */}
            <div className="prose max-w-none">
              {activeTab === 'description' && (
                <div>
                  <p className="text-slate-700 mb-4">
                    {product.description} Tradición culinaria boliviana preparada con los mejores ingredientes locales.
                  </p>
                  <p className="text-slate-700">
                    Este platillo representa la riqueza gastronómica de Bolivia, combinando sabores autóctonos con técnicas tradicionales de preparación.
                  </p>
                </div>
              )}
              
              {activeTab === 'ingredients' && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-3">Ingredientes principales:</h4>
                  <ul className="list-disc pl-5 text-slate-700 space-y-1">
                    <li>Carne de res/pollo (según elección)</li>
                    <li>Papa boliviana</li>
                    <li>Arvejas frescas</li>
                    <li>Aceitunas</li>
                    <li>Especias tradicionales</li>
                    <li>Masa artesanal</li>
                  </ul>
                  <p className="text-sm text-slate-500 mt-4">
                    🌱 Contiene gluten | 🥛 Puede contener lácteos
                  </p>
                </div>
              )}
              {activeTab === 'reviews' && (
  <div>
    <div className="flex items-center gap-4 mb-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-slate-900">4.8</div>
        <div className="flex items-center justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <FiStar key={star} className="text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-1">52 reseñas</p>
      </div>
      <div className="flex-1">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-2 mb-1">
            <span className="text-sm text-slate-600 w-8">{rating}★</span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400"
                style={{ width: `${rating * 20}%` }}
              ></div>
            </div>
            <span className="text-sm text-slate-500 w-10">{rating * 10}</span>
          </div>
        ))}
      </div>
    </div>
    
    {/* Ejemplo de review */}
    <div className="border-t border-slate-200 pt-6">
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
            <span className="text-sm text-slate-500">Hace 2 días</span>
          </div>
          <p className="text-slate-700">¡Increíble! El sabor auténtico de Bolivia. Definitivamente volveré a pedir.</p>
        </div>
      </div>
    </div>
  </div>
)}

            </div>
          </div>
        </div>
        
        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Productos relacionados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
        
        {/* Botón volver */}
        <div className="mt-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:border-blue-400 hover:text-blue-600"
          >
            <FiArrowLeft />
            Volver al menú
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;