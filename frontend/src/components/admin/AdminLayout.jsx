// frontend/src/components/admin/AdminLayout.jsx - VERSIÓN COMPLETA CORREGIDA
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
  FiSearch,
  FiKey
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <FiPackage />, label: 'Pedidos' },
    { path: '/admin/products', icon: <FiShoppingCart />, label: 'Productos' },
    { path: '/admin/customers', icon: <FiUsers />, label: 'Clientes' },
    { path: '/admin/analytics', icon: <FiTrendingUp />, label: 'Analíticas' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Configuración' }
  ];

  // Añadir enlace para superadmin si corresponde
  const allMenuItems = user?.role === 'superadmin' 
    ? [
        ...menuItems,
        { path: '/create-invite', icon: <FiKey />, label: 'Generar Invitaciones', isSuperadmin: true }
      ]
    : menuItems;

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
              {allMenuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    location.pathname === item.path 
                      ? item.isSuperadmin
                        ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${item.isSuperadmin ? 'border-l-4 border-purple-500' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.isSuperadmin && (
                    <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      SUPER
                    </span>
                  )}
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
            {user?.role === 'superadmin' && (
              <div className="mt-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-3">
                <p className="text-sm font-medium text-purple-800 flex items-center gap-2">
                  <FiKey className="text-purple-600" />
                  Modo Super Administrador
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Acceso completo al sistema
                </p>
              </div>
            )}
          </div>
          
          {/* Menú de navegación */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {allMenuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === item.path 
                      ? item.isSuperadmin
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : item.isSuperadmin
                        ? 'text-purple-700 hover:bg-purple-50 hover:shadow-sm border-l-4 border-purple-400'
                        : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.isSuperadmin && (
                    <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      SUPER
                    </span>
                  )}
                </Link>
              ))}
            </div>
            
            {/* Información del usuario */}
            <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-fuchsia-500 rounded-full">
                  <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=805AD5&color=fff`}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name || 'Administrador'}</p>
                  <p className="text-sm text-gray-500">{user?.email || 'admin@ecommerce.bo'}</p>
                  {user?.role === 'superadmin' && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-1 inline-block">
                      SUPER ADMIN
                    </span>
                  )}
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
                  {allMenuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  {location.pathname === '/admin' && 'Visión general del negocio'}
                  {location.pathname === '/admin/orders' && 'Gestiona todos los pedidos'}
                  {location.pathname === '/admin/products' && 'Administra el catálogo'}
                  {location.pathname === '/admin/customers' && 'Base de datos de clientes'}
                  {location.pathname === '/admin/analytics' && 'Estadísticas y métricas'}
                  {location.pathname === '/admin/settings' && 'Configuración del sistema'}
                  {location.pathname === '/create-invite' && 'Genera códigos para nuevos administradores'}
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
                
                {/* Enlace rápido para superadmin */}
                {user?.role === 'superadmin' && location.pathname !== '/create-invite' && (
                  <Link
                    to="/create-invite"
                    className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
                  >
                    <FiKey />
                    <span className="font-medium">Generar Invitaciones</span>
                  </Link>
                )}
                
                {/* Notificaciones */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100">
                  <FiBell className="w-6 h-6 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Perfil de usuario (solo desktop) */}
                <div className="hidden lg:flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-fuchsia-500 rounded-full">
                    <img 
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=805AD5&color=fff`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{user?.name?.split(' ')[0] || 'Admin'}</p>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Área de contenido */}
          <main className="p-6">
            {/* Banner informativo para superadmin */}
            {user?.role === 'superadmin' && location.pathname !== '/create-invite' && (
              <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <FiKey className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-800">Super Administrador</h3>
                      <p className="text-sm text-purple-600">
                        Tienes acceso completo al sistema, incluyendo generación de códigos de invitación.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/create-invite"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
                  >
                    <FiKey />
                    Ir a Invitaciones
                  </Link>
                </div>
              </div>
            )}
            
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

export default AdminLayout;