import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiDollarSign, FiUsers, FiShoppingCart, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const AdminDashboard = () => {
  const { t } = useLanguage();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const uniqueCustomers = new Set(orders.map(o => o.userId).filter(Boolean));
    
    setStats({
      totalOrders: orders.length,
      totalRevenue: totalRevenue,
      totalCustomers: uniqueCustomers.size,
      pendingOrders: orders.filter(o => o.status === 'pending').length
    });

    const sorted = [...orders].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    setRecentOrders(sorted.slice(0, 5).map(o => ({
      id: o.id || 'N/A',
      customer: o.shippingInfo?.fullName || o.userName || o.customerName || 'Cliente',
      amount: o.total || 0,
      status: o.status === 'completed' ? 'Completado' : o.status === 'pending' ? 'Pendiente' : 'En proceso',
      date: o.date ? new Date(o.date).toLocaleDateString() : ''
    })));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">{t('admin.dashboard.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm p-6 border border-gray-200 dark:border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.dashboard.statOrders')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalOrders}</p>
            </div>
            <FiPackage className="w-10 h-10 text-blue-500" />
          </div>
          <Link to="/admin/orders" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 text-sm mt-4 block">
            {t('admin.dashboard.viewAll')} →
          </Link>
        </div>
        
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm p-6 border border-gray-200 dark:border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.dashboard.statRevenue')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">Bs. {stats.totalRevenue.toFixed(2)}</p>
            </div>
            <FiDollarSign className="w-10 h-10 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm p-6 border border-gray-200 dark:border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.dashboard.statCustomers')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCustomers}</p>
            </div>
            <FiUsers className="w-10 h-10 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm p-6 border border-gray-200 dark:border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.dashboard.statPending')}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingOrders}</p>
            </div>
            <FiAlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm p-6 border border-gray-200 dark:border-[#334155]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('admin.dashboard.recentOrders')}</h2>
            <Link to="/admin/orders" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
              {t('admin.dashboard.viewAll')}
            </Link>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{order.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-gray-100">Bs. {order.amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Completado' ? 'bg-green-100 text-green-800' :
                      order.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No hay pedidos aún</p>
          )}
        </div>
        
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm p-6 border border-gray-200 dark:border-[#334155]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('admin.dashboard.monthlyRevenue')}</h2>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 dark:from-[#1e293b] dark:to-[#0f172a] rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">{t('admin.dashboard.chartPlaceholder')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;