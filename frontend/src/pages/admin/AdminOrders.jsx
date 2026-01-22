// frontend/src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { FiPackage, FiUser, FiMapPin, FiCreditCard, FiCalendar, FiShoppingCart, FiDollarSign, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Cargar pedidos desde localStorage
  useEffect(() => {
    loadOrdersFromStorage();
  }, []);

  const loadOrdersFromStorage = () => {
    console.log('🔍 Buscando pedidos en localStorage...');
    
    // OPCIÓN 1: Leer del array 'orders' que guarda Checkout.jsx
    try {
      const ordersArray = JSON.parse(localStorage.getItem('orders') || '[]');
      console.log('📦 Pedidos encontrados en array:', ordersArray);
      
      // Transformar el formato
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
          rawData: order // Mantener datos originales
        };
      });
      
      // Ordenar por fecha (más recientes primero)
      formattedOrders.sort((a, b) => b.timestamp - a.timestamp);
      
      setOrders(formattedOrders);
      console.log(`✅ Total pedidos encontrados: ${formattedOrders.length}`);
    } catch (error) {
      console.error('❌ Error al leer pedidos:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un pedido
  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`¿Estás seguro de eliminar el pedido ${orderId}?`)) {
      // Eliminar del array 'orders'
      const ordersArray = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = ordersArray.filter(order => order.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Eliminar también si existe con prefijo 'order_'
      localStorage.removeItem(`order_${orderId}`);
      
      loadOrdersFromStorage(); // Recargar la lista
    }
  };

  // Función para cambiar estado de pedido
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

  // Función para ver detalles
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Función para refrescar manualmente
  const handleRefresh = () => {
    setLoading(true);
    loadOrdersFromStorage();
  };

  // Filtrar pedidos por estado
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  // Calcular estadísticas
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const uniqueCustomers = [...new Set(orders.map(order => order.email))].filter(email => email).length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  // Renderizar badge de estado
  const renderStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FiClock />, text: 'Pendiente' },
      processing: { color: 'bg-blue-100 text-blue-800', icon: <FiTruck />, text: 'Procesando' },
      completed: { color: 'bg-green-100 text-green-800', icon: <FiCheckCircle />, text: 'Completado' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <FiXCircle />, text: 'Cancelado' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  // Renderizar método de pago
  const renderPaymentMethod = (method) => {
    const methodConfig = {
      cash: { icon: '💵', text: 'Efectivo' },
      qr: { icon: '📱', text: 'QR' },
      card: { icon: '💳', text: 'Tarjeta' }
    };
    
    const config = methodConfig[method] || { icon: '💰', text: 'Desconocido' };
    
    return (
      <span className="flex items-center gap-1">
        <span>{config.icon}</span>
        <span>{config.text}</span>
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Modal de Detalles */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Detalles del Pedido</h2>
                  <p className="text-gray-600">#{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              {/* Información del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiUser /> Información del Cliente
                  </h3>
                  <p className="text-gray-900">{selectedOrder.customerName}</p>
                  <p className="text-gray-600">{selectedOrder.email}</p>
                  <p className="text-gray-600">{selectedOrder.phone}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiMapPin /> Dirección de Entrega
                  </h3>
                  <p className="text-gray-900">{selectedOrder.address}</p>
                </div>
              </div>

              {/* Productos */}
              <div className="mb-8">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiShoppingCart /> Productos ({selectedOrder.itemCount})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">Bs. {(item.price || 0).toFixed(2)} c/u</p>
                        <p className="font-medium text-gray-900">
                          Bs. {((item.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Bs. {(selectedOrder.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>Bs. {(selectedOrder.shipping || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Impuestos</span>
                    <span>Bs. {(selectedOrder.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-blue-600">Bs. {(selectedOrder.total || 0).toFixed(2)}</span>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FiCreditCard className="text-gray-400" />
                    <span>Método de pago: {renderPaymentMethod(selectedOrder.paymentMethod)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-400" />
                    <span>Fecha: {selectedOrder.orderDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPackage className="text-gray-400" />
                    <span>Estado: {renderStatusBadge(selectedOrder.status)}</span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    updateOrderStatus(selectedOrder.id, 'completed');
                    setShowDetailsModal(false);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  disabled={selectedOrder.status === 'completed'}
                >
                  Marcar como Completado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Gestión de Pedidos</h1>
          <p className="text-gray-600">Administra y sigue todos los pedidos de tu e-commerce</p>
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="processing">En proceso</option>
            <option value="completed">Completados</option>
            <option value="cancelled">Cancelados</option>
          </select>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refrescar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pedidos</p>
              <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-900">
                Bs. {totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Únicos</p>
              <p className="text-3xl font-bold text-gray-900">{uniqueCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiUser className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-sm p-6 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-gray-100 rounded-2xl p-12 text-center border border-gray-200">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">📭</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No hay pedidos aún</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Los pedidos aparecerán aquí automáticamente después de que los clientes completen el checkout.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Para probar:</p>
            <ol className="text-sm text-gray-600 text-left max-w-sm mx-auto">
              <li className="mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">1</span>
                Ve a <span className="font-mono bg-gray-100 px-2 py-1 rounded">/menu</span>
              </li>
              <li className="mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">2</span>
                Agrega productos al carrito
              </li>
              <li className="mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">3</span>
                Completa el checkout con datos de prueba
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">4</span>
                ¡El pedido aparecerá aquí!
              </li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">ID Pedido</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Cliente</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Fecha</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Total</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Pago</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Estado</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.orderId} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">#{order.orderId}</div>
                      <div className="text-sm text-gray-500">{order.itemCount} productos</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" />
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
                          className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 hover:bg-blue-50 rounded"
                        >
                          Detalles
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="text-red-600 hover:text-red-800 font-medium px-3 py-1 hover:bg-red-50 rounded"
                        >
                          Eliminar
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="text-green-600 hover:text-green-800 font-medium px-3 py-1 hover:bg-green-50 rounded"
                          >
                            Completar
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

      {/* Pie de página */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          Mostrando {filteredOrders.length} de {orders.length} pedidos • 
          Última actualización: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

// Icono de refrescar (agregar si no está)
const FiRefreshCw = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default AdminOrders;