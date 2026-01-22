// frontend/src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiSettings, 
  FiMenu, 
  FiX, 
  FiLogOut,
  FiTrendingUp,
  FiBell,
  FiSearch
} from 'react-icons/fi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <FiPackage />, label: 'Pedidos' },
    { path: '/admin/products', icon: <FiShoppingCart />, label: 'Productos' },
    { path: '/admin/customers', icon: <FiUsers />, label: 'Clientes' },
    { path: '/admin/analytics', icon: <FiTrendingUp />, label: 'Analíticas' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Configuración' }
  ];

  const handleLogout = () => {
    // En un proyecto real, aquí limpiarías el token de autenticación
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para móviles */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-50" 
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🍽️</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                    <p className="text-sm text-gray-500">E-commerce Bolivia</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <FiX className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              {/* Barra de búsqueda en móvil */}
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <nav className="p-4">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Botón de logout en móvil */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-700 hover:bg-gray-100 w-full mt-8"
              >
                <FiLogOut />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Layout principal */}
      <div className="flex">
        {/* Sidebar para desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 min-h-screen">
          {/* Logo y título */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">E-commerce Bolivia</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Panel de administración</p>
          </div>
          
          {/* Menú de navegación */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
            
            {/* Información del usuario */}
            <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-fuchsia-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Administrador</p>
                  <p className="text-sm text-gray-500">admin@ecommerce.bo</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <FiLogOut />
                Cerrar Sesión
              </button>
            </div>
          </nav>
          
          {/* Footer del sidebar */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              v1.0.0 • E-commerce Bolivia
            </p>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Header superior */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Botón para abrir sidebar en móvil */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <FiMenu className="w-6 h-6 text-gray-700" />
              </button>
              
              {/* Título de página actual */}
              <div className="hidden lg:block">
                <h2 className="text-xl font-bold text-gray-900">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  {location.pathname === '/admin' && 'Visión general del negocio'}
                  {location.pathname === '/admin/orders' && 'Gestiona todos los pedidos'}
                  {location.pathname === '/admin/products' && 'Administra el catálogo'}
                  {location.pathname === '/admin/customers' && 'Base de datos de clientes'}
                  {location.pathname === '/admin/analytics' && 'Estadísticas y métricas'}
                  {location.pathname === '/admin/settings' && 'Configuración del sistema'}
                </p>
              </div>
              
              {/* Controles del header */}
              <div className="flex items-center gap-4">
                {/* Barra de búsqueda (solo desktop) */}
                <div className="hidden lg:block relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar pedidos, productos, clientes..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
                
                {/* Notificaciones */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100">
                  <FiBell className="w-6 h-6 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Perfil de usuario (solo desktop) */}
                <div className="hidden lg:flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-fuchsia-500 rounded-full"></div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">Administrador</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Área de contenido */}
          <main className="p-6">
            <Outlet /> {/* Aquí se renderizan AdminDashboard, AdminOrders, etc. */}
          </main>
          
          {/* Footer */}
          <footer className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600 mb-2 md:mb-0">
                © 2024 E-commerce Bolivia. Todos los derechos reservados.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Ayuda</a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Privacidad</a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Términos</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// ✅ ¡IMPORTANTE! Esta línea debe estar al final
export default AdminLayout;