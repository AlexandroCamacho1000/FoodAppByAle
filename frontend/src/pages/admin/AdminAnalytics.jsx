import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiUsers, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const AdminAnalytics = () => {
  const { t, language } = useLanguage();

  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    uniqueCustomers: 0,
    avgTicket: 0
  });

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const uniqueCustomers = new Set(orders.map(o => o.userId).filter(Boolean)).size;

    setAnalytics({
      totalRevenue,
      totalOrders: orders.length,
      uniqueCustomers,
      avgTicket: orders.length > 0 ? totalRevenue / orders.length : 0
    });
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('admin.analytics.title')}</h1>
            <p className="text-gray-600">
              {language === 'es' ? 'Estadísticas y métricas del negocio' : 'Business statistics and metrics'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'es' ? 'Ventas Totales' : 'Total Sales'}
              </p>
              <p className="text-2xl font-bold text-gray-900">Bs. {analytics.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'es' ? 'Pedidos Totales' : 'Total Orders'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiShoppingCart className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'es' ? 'Clientes Únicos' : 'Unique Customers'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{analytics.uniqueCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiUsers className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'es' ? 'Ticket Promedio' : 'Average Ticket'}
              </p>
              <p className="text-2xl font-bold text-gray-900">Bs. {analytics.avgTicket.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiBarChart2 className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'es' ? 'Ventas por Mes' : 'Monthly Sales'}
            </h2>
            <FiPieChart className="text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-gray-400 text-5xl mb-4">📊</div>
              <p className="text-gray-600">
                {language === 'es' ? 'Gráfico de ventas mensuales' : 'Monthly sales chart'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'es' ? '(Integrar con Chart.js o Recharts)' : '(Integrate with Chart.js or Recharts)'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {language === 'es' ? 'Productos más Vendidos' : 'Best Selling Products'}
            </h2>
            <FiBarChart2 className="text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <img src="/alesoft.png" alt="AleSoft" className="w-12 h-12 object-contain mx-auto mb-4" />
              <p className="text-gray-600">
                {language === 'es' ? 'Gráfico de productos populares' : 'Popular products chart'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'es' ? '(Datos en tiempo real)' : '(Real-time data)'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiTrendingUp className="text-blue-600 mt-1" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">{t('admin.analytics.title')}</h3>
            <p className="text-sm text-blue-700 mt-1">
              {language === 'es'
                ? 'Esta página muestra métricas clave del negocio calculadas desde los pedidos almacenados.'
                : 'This page shows key business metrics calculated from stored orders.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;