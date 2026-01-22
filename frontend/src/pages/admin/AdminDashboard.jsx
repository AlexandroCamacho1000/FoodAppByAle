// frontend/src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiDollarSign, FiUsers, FiShoppingCart, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  // Datos de ejemplo (en un proyecto real vendrían de una API)
  const stats = {
    totalOrders: 42,
    totalRevenue: 12540.50,
    totalCustomers: 28,
    pendingOrders: 3
  };

  const recentOrders = [
    { id: 'BOL-789012', customer: 'María Pérez', amount: 245.00, status: 'Entregado', date: '2024-09-20' },
    { id: 'BOL-789011', customer: 'Carlos López', amount: 89.50, status: 'En camino', date: '2024-09-19' },
    { id: 'BOL-789010', customer: 'Ana García', amount: 156.75, status: 'Preparando', date: '2024-09-18' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 Panel de Administración</h1>
      
      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pedidos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <FiPackage className="w-10 h-10 text-blue-500" />
          </div>
          <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm mt-4 block">
            Ver todos →
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-900">Bs. {stats.totalRevenue.toFixed(2)}</p>
            </div>
            <FiDollarSign className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <FiUsers className="w-10 h-10 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
            <FiAlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>
      
      {/* Pedidos Recientes y Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">📋 Pedidos Recientes</h2>
            <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm">
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">Bs. {order.amount.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Entregado' ? 'bg-green-100 text-green-800' :
                    order.status === 'En camino' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Ingresos Mensuales</h2>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg">
            <p className="text-gray-500">Gráfico de ingresos se mostraría aquí</p>
            {/* En un proyecto real usarías Chart.js o similar */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;