// frontend/pages/Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';

export default function Cart() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const { 
    cart,
    removeFromCart, 
    updateQuantity, 
    clearCart,
    subtotal,
    shipping,
    tax,
    total,
    totalItems,
    isEmpty,
    hasFreeShipping,
    freeShippingThreshold = 100
  } = useCart();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (isEmpty) {
      alert(t('cart.empty'))
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {t('cart.title')}
      </h1>
      <p className="text-gray-600 mb-8">
        {t('cart.itemsCount').replace('{count}', totalItems)}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          {!isEmpty ? (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 flex flex-col sm:flex-row gap-4"
                >
                  {/* Imagen */}
                  <div className="w-full sm:w-24 h-48 sm:h-24 bg-gradient-to-br from-blue-50 to-pink-50 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                  </div>

                  {/* Detalles */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="mt-2 text-blue-600 font-medium">
                          Bs. {item.price?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 p-2"
                        aria-label={t('cart.removeLabel')}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      {/* Contador */}
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center transition-colors"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="font-medium w-8 text-center text-gray-900">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center transition-colors"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          Bs. {((item.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón para vaciar carrito */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  {t('cart.clear')}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center border border-gray-200">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('cart.empty')}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {t('cart.emptyDescription')}
              </p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                <FaArrowLeft />
                {t('menu')}
              </Link>
            </div>
          )}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t('cart.summary')}
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>{t('cart.subtotal')}</span>
                <span className="font-medium">Bs. {subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-700">
                <span>{t('cart.shipping')}</span>
                <div>
                  <span className="font-medium">Bs. {shipping.toFixed(2)}</span>
                  {hasFreeShipping && (
                    <span className="text-sm text-green-600 ml-2">
                      ({t('cart.free')})
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between text-gray-700">
                <span>{t('cart.tax')}</span>
                <span className="font-medium">Bs. {tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-300 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>{t('cart.total')}</span>
                  <span className="text-blue-600">Bs. {total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {t('cart.vatIncluded')}
                </p>
              </div>

              {/* Información de envío gratis */}
              {!hasFreeShipping && subtotal < freeShippingThreshold && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    {t('cart.freeShippingInfo').replace('{amount}', (freeShippingThreshold - subtotal).toFixed(2))}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleCheckout}
              disabled={isEmpty}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                isEmpty
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              {t('cart.checkout')}
            </button>

            <Link
              to="/menu"
              className="w-full mt-4 border-2 border-gray-400 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FaArrowLeft />
              {t('cart.continue')}
            </Link>

            {/* Info adicional */}
            <div className="mt-6 pt-6 border-t border-gray-300">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span className="text-green-600">✓</span>
                <span>{t('cart.securityInfo')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-600">✓</span>
                <span>
                  {t('cart.freeShippingThreshold').replace('{threshold}', freeShippingThreshold)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}