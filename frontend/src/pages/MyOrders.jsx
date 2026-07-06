// frontend/src/pages/MyOrders.jsx
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const MyOrders = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Obtener pedidos del localStorage (simulados)
  const getOrders = () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return user?.role === 'superadmin' ? orders : orders.filter(order => order.userId === user?.id || order.userEmail === user?.email);
  };

  const orders = getOrders();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1E293B] mb-2">{t('orders.title')}</h1>
      <p className="text-[#64748B] mb-8">{t('orders.subtitle')}</p>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="bg-white rounded-xl shadow border border-[#E2E8F0] p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{t('orders.orderLabel')} #{order.id?.slice(-6) || `ORD${index + 1}`}</h3>
                  <p className="text-sm text-[#64748B]">
                    {new Date(order.date || Date.now()).toLocaleDateString('es-BO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">Bs. {order.total?.toFixed(2) || '0.00'}</p>
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
              
              <div className="border-t border-[#E2E8F0] pt-4">
                <h4 className="font-medium mb-2">{t('orders.products')}</h4>
                <div className="space-y-2">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
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
          <h3 className="text-xl font-medium text-[#1E293B] mb-2">{t('orders.empty')}</h3>
          <p className="text-[#64748B] mb-6">{t('orders.emptyDesc')}</p>
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