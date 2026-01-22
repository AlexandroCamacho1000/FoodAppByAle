// frontend/src/pages/admin/AdminAnalytics.jsx
import React from 'react';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiUsers, FiPieChart, FiBarChart2 } from 'react-icons/fi';

const AdminAnalytics = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analíticas</h1>
            <p className="text-gray-600">Estadísticas y métricas del negocio</p>
          </div>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900">Bs. 45,280</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="text-sm text-green-600 flex items-center">
            <FiTrendingUp className="mr-1" />
            <span>+12.5% este mes</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Pedidos Totales</p>
              <p className="text-2xl font-bold text-gray-900">324</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiShoppingCart className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="text-sm text-green-600 flex items-center">
            <FiTrendingUp className="mr-1" />
            <span>+8.2% este mes</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Clientes Activos</p>
              <p className="text-2xl font-bold text-gray-900">1,248</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiUsers className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="text-sm text-green-600 flex items-center">
            <FiTrendingUp className="mr-1" />
            <span>+15.3% este mes</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Ticket Promedio</p>
              <p className="text-2xl font-bold text-gray-900">Bs. 139.75</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiBarChart2 className="text-orange-600 text-xl" />
            </div>
          </div>
          <div className="text-sm text-red-600 flex items-center">
            <FiTrendingUp className="mr-1 transform rotate-180" />
            <span>-2.1% este mes</span>
          </div>
        </div>
      </div>

      {/* Gráficos placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Ventas por Mes</h2>
            <FiPieChart className="text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-gray-400 text-5xl mb-4">📊</div>
              <p className="text-gray-600">Gráfico de ventas mensuales</p>
              <p className="text-sm text-gray-500">(Integrar con Chart.js o Recharts)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Productos más Vendidos</h2>
            <FiBarChart2 className="text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-gray-400 text-5xl mb-4">🥘</div>
              <p className="text-gray-600">Gráfico de productos populares</p>
              <p className="text-sm text-gray-500">(Datos en tiempo real)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiTrendingUp className="text-blue-600 mt-1" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Panel de Analíticas</h3>
            <p className="text-sm text-blue-700 mt-1">
              Esta página muestra métricas clave del negocio. En una implementación completa, 
              se integraría con Chart.js, Recharts o una librería similar para visualizar 
              datos de ventas, clientes y productos en tiempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;