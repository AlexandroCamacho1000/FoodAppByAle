import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const MyOrders = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [orders] = useState(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = user?.role === 'superadmin'
      ? allOrders
      : allOrders.filter(order => order.userId === user?.id || order.userEmail === user?.email);
    return userOrders.map(order => ({
      ...order,
      formattedDate: new Date(order.date || Date.now()).toLocaleDateString('es-BO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }));
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('orders.title')}</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">{t('orders.subtitle')}</p>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="bg-white dark:bg-[#1e293b] rounded-xl shadow border border-gray-200 dark:border-[#334155] p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{t('orders.orderLabel')} #{order.id?.slice(-6) || `ORD${index + 1}`}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.formattedDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900 dark:text-gray-100">Bs. {order.total?.toFixed(2) || '0.00'}</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'completed' ? t('orders.status.completed') : 
                     order.status === 'pending' ? t('orders.status.pending') : t('orders.status.processing')}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-[#334155] pt-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('orders.products')}</h4>
                <div className="space-y-2">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                      <span>{item.name} x {item.quantity}</span>
                      <span>Bs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">{t('orders.empty')}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{t('orders.emptyDesc')}</p>
          <Link 
            to="/menu" 
            className="inline-block bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition"
          >
            {t('orders.viewProducts')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrders;