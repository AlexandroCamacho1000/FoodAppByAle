import React, { useState, useEffect } from 'react';
import { FiPackage, FiUser, FiMapPin, FiCreditCard, FiCalendar, FiShoppingCart, FiDollarSign, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const AdminOrders = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadOrdersFromStorage();
  }, []);

  const loadOrdersFromStorage = () => {
    
    
    try {
      const ordersArray = JSON.parse(localStorage.getItem('orders') || '[]');
      
      
      const formattedOrders = ordersArray.map(order => {
        const orderDate = order.date ? new Date(order.date) : new Date();
        return {
          orderId: order.id || `ORD-${Date.now()}`,
          id: order.id,
          customerName: order.shippingInfo?.fullName || order.customerName || 'Cliente',
          email: order.shippingInfo?.email || '',
          phone: order.shippingInfo?.phone || '',
          address: `${order.shippingInfo?.address || ''}, ${order.shippingInfo?.city || ''}`,
          total: order.total || 0,
          paymentMethod: order.paymentMethod || 'cash',
          orderDate: orderDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          itemCount: order.items?.length || 0,
          items: order.items || [],
          status: order.status || 'pending',
          subtotal: order.subtotal || 0,
          shipping: order.shipping || 0,
          tax: order.tax || 0,
          timestamp: orderDate.getTime(),
          rawData: order
        };
      });
      
      formattedOrders.sort((a, b) => b.timestamp - a.timestamp);
      
      setOrders(formattedOrders);
      
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(t('admin.orders.confirm.delete', { id: orderId }))) {
      const ordersArray = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = ordersArray.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      localStorage.removeItem(`order_${orderId}`);
      
      loadOrdersFromStorage();
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const ordersArray = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = ordersArray.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    loadOrdersFromStorage();
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleRefresh = () => {
    setLoading(true);
    loadOrdersFromStorage();
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const uniqueCustomers = [...new Set(orders.map(order => order.email))].filter(email => email).length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  const renderStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock />, text: t('admin.orders.status.pending') },
      processing: { color: 'bg-blue-100 text-blue-800', icon: <FiTruck />, text: t('admin.orders.status.processing') },
      completed: { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle />, text: t('admin.orders.status.completed') },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FiXCircle />, text: t('admin.orders.status.cancelled') }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const renderPaymentMethod = (method) => {
    const methodConfig = {
      cash: { icon: '💵', text: t('admin.orders.payment.cash') },
      qr: { icon: '📱', text: t('admin.orders.payment.qr') },
      card: { icon: '💳', text: t('admin.orders.payment.card') }
    };
    
    const config = methodConfig[method] || { icon: '💰', text: t('admin.orders.payment.unknown') };
    
    return (
      <span className="flex items-center gap-1">
        <span>{config.icon}</span>
        <span>{config.text}</span>
      </span>
    );
  };

  return (
    <div className="p-6">
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('admin.orders.modal.title')}</h2>
                  <p className="text-gray-600 dark:text-gray-400">#{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-[#0f172a] p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FiUser /> {t('admin.orders.modal.client')}
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">{selectedOrder.customerName}</p>
                  <p className="text-gray-600 dark:text-gray-400">{selectedOrder.email}</p>
                  <p className="text-gray-600 dark:text-gray-400">{selectedOrder.phone}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-[#0f172a] p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <FiMapPin /> {t('admin.orders.modal.address')}
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">{selectedOrder.address}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FiShoppingCart /> {t('admin.orders.modal.products', { count: selectedOrder.itemCount })}
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-[#334155] rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('checkout.quantity', { quantity: item.quantity })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 dark:text-gray-100">Bs. {(item.price || 0).toFixed(2)} c/u</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Bs. {((item.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-[#334155] pt-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t('admin.orders.modal.subtotal')}</span>
                    <span>Bs. {(selectedOrder.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t('admin.orders.modal.shipping')}</span>
                    <span>Bs. {(selectedOrder.shipping || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{t('admin.orders.modal.tax')}</span>
                    <span>Bs. {(selectedOrder.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100 pt-3 border-t border-gray-200 dark:border-[#334155]">
                    <span>{t('admin.orders.modal.total')}</span>
                    <span className="text-blue-600">Bs. {(selectedOrder.total || 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FiCreditCard className="text-gray-400 dark:text-gray-500" />
                    <span>{t('admin.orders.modal.paymentMethod')} {renderPaymentMethod(selectedOrder.paymentMethod)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-400 dark:text-gray-500" />
                    <span>{t('admin.orders.modal.date')} {selectedOrder.orderDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPackage className="text-gray-400 dark:text-gray-500" />
                    <span>{t('admin.orders.modal.status')} {renderStatusBadge(selectedOrder.status)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-[#334155]">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-[#475569] rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#334155]"
                >
                  {t('admin.orders.modal.close')}
                </button>
                <button
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'completed');
                    setShowDetailsModal(false);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  disabled={selectedOrder.status === 'completed'}
                >
                  {t('admin.orders.modal.markComplete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('admin.orders.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('admin.orders.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-[#475569] rounded-lg bg-white dark:bg-[#1e293b]"
          >
            <option value="all">{t('admin.orders.filterAll')}</option>
            <option value="pending">{t('admin.orders.filterPending')}</option>
            <option value="processing">{t('admin.orders.filterProcessing')}</option>
            <option value="completed">{t('admin.orders.filterCompleted')}</option>
            <option value="cancelled">{t('admin.orders.filterCancelled')}</option>
          </select>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            {t('admin.orders.refresh')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-[#1e293b] rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.orders.statTotal')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-[#1e293b] rounded-xl shadow-sm p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.orders.statRevenue')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Bs. {totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-[#1e293b] rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.orders.statCustomers')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{uniqueCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiUser className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-[#1e293b] rounded-xl shadow-sm p-6 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.orders.statPending')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

            {loading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-[#334155]">
            <thead className="bg-gray-50 dark:bg-[#0f172a]">
              <tr>
                {[1, 2, 3, 4, 5].map(i => (
                  <th key={i} className="px-4 py-3">
                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1e293b] divide-y divide-gray-200 dark:divide-[#334155]">
              {Array.from({ length: 5 }).map((_, row) => (
                <tr key={row} className="animate-pulse">
                  {[1, 2, 3, 4, 5].map(col => (
                    <td key={col} className="px-4 py-3">
                      <div className={`bg-gray-200 h-4 rounded ${col === 1 ? 'w-32' : 'w-20'}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-gray-100 dark:from-blue-900/20 dark:to-[#0f172a] rounded-2xl p-12 text-center border border-gray-200 dark:border-[#334155]">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">📭</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{t('admin.orders.empty')}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {t('admin.orders.emptyDesc')}
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('admin.orders.testInstructions')}</p>
            <ol className="text-sm text-gray-600 dark:text-gray-400 text-left max-w-sm mx-auto">
              <li className="mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">1</span>
                {t('admin.orders.testStep1')}
              </li>
              <li className="mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">2</span>
                {t('admin.orders.testStep2')}
              </li>
              <li className="mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">3</span>
                {t('admin.orders.testStep3')}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">4</span>
                {t('admin.orders.testStep4')}
              </li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-[#334155]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0f172a]">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.orders.table.id')}</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.orders.table.client')}</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.orders.table.date')}</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.orders.table.total')}</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.orders.table.payment')}</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.orders.table.status')}</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.orders.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.orderId} className="border-t border-gray-200 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#334155]">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-gray-100">#{order.orderId}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('admin.orders.items', { count: order.itemCount })}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400 dark:text-gray-500" />
                        <span>{order.orderDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-blue-600">Bs. {order.total.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      {renderPaymentMethod(order.paymentMethod)}
                    </td>
                    <td className="py-4 px-6">
                      {renderStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          {t('admin.orders.btn.details')}
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="text-red-600 hover:text-red-800 font-medium px-3 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          {t('admin.orders.btn.delete')}
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="text-green-600 hover:text-green-800 font-medium px-3 py-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                          >
                            {t('admin.orders.btn.complete')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>
          {t('admin.orders.footer', { shown: filteredOrders.length, total: orders.length, time: new Date().toLocaleTimeString() })}
        </p>
      </div>
    </div>
  );
};

const FiRefreshCw = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default AdminOrders;