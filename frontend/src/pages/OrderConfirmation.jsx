import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiHome, FiPackage, FiClock, FiMail, FiPhone } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const OrderConfirmation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { 
    orderId = 'BOL-' + Math.floor(100000 + Math.random() * 900000), 
    orderDate = new Date().toLocaleDateString(), 
    total = 0,
    customerName = '',
    address = '',
    items = 0,
    paymentMethod = 'cash',
    cardDetails = null,
    orderData = null
  } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-8">
            <FiCheckCircle className="text-6xl text-green-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('orderConfirmation.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {t('orderConfirmation.subtitle')}
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-[#334155]">
            <div className="flex items-center justify-center gap-3 mb-6">
              <FiShoppingBag className="text-3xl text-blue-500" />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {t('orderConfirmation.orderNumber')} <span className="text-blue-600 dark:text-blue-400">{orderId}</span>
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-6">
              <div className="p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiClock className="text-blue-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t('orderConfirmation.dateLabel')}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{orderDate}</p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiPackage className="text-blue-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t('orderConfirmation.products')}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{items} {t('orderConfirmation.items')}</p>
              </div>
              
              {customerName && (
                <div className="p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMail className="text-blue-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{t('orderConfirmation.client')}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{customerName}</p>
                </div>
              )}
              
              <div className="p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiPhone className="text-blue-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t('orderConfirmation.payment')}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {paymentMethod === 'cash' ? t('checkout.payment.cash') :
                   paymentMethod === 'qr' ? t('checkout.payment.qr') :
                   paymentMethod === 'card' ? t('checkout.payment.card') : paymentMethod}
                  {cardDetails && ` - ${cardDetails.brand} ****${cardDetails.last4}`}
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-blue-50 to-fuchsia-50 rounded-xl mb-6">
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Bs. {typeof total === 'number' ? total.toFixed(2) : total}
              </p>
              <p className="text-gray-600 dark:text-gray-400">{t('orderConfirmation.totalPaid')}</p>
            </div>
            
            <Link
              to="/my-orders"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-fuchsia-700 transition-all"
            >
              <FiPackage />
              {t('orderConfirmation.viewOrders')}
            </Link>
          </div>
          
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
            <FiHome />
            {t('orderConfirmation.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;