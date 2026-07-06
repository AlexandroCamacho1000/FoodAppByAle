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
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitch from '../ui/LanguageSwitch';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <FiPackage />, label: t('admin.orders.title') },
    { path: '/admin/products', icon: <FiShoppingCart />, label: t('admin.products.title') },
    { path: '/admin/customers', icon: <FiUsers />, label: t('admin.customers.title') },
    { path: '/admin/analytics', icon: <FiTrendingUp />, label: t('admin.analytics.title') },
    { path: '/admin/settings', icon: <FiSettings />, label: t('admin.settings.title') }
  ];

  const allMenuItems = user?.role === 'superadmin' 
    ? [
        ...menuItems,
        { path: '/create-invite', icon: <FiKey />, label: t('admin.invites.title'), isSuperadmin: true }
      ]
    : menuItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                    <h2 className="text-xl font-bold text-gray-900">{t('admin.layout.title')}</h2>
                    <p className="text-sm text-gray-500">{t('admin.layout.subtitle')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <FiX className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('admin.layout.search')}
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
                      {t('admin.layout.super')}
                    </span>
                  )}
                </Link>
              ))}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-gray-700 hover:bg-gray-100 w-full mt-8"
              >
                <FiLogOut />
                {t('admin.layout.logout')}
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('admin.layout.title')}</h1>
                <p className="text-sm text-gray-500">{t('admin.layout.subtitle')}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">{t('admin.layout.description')}</p>
            {user?.role === 'superadmin' && (
              <div className="mt-3 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-3">
                <p className="text-sm font-medium text-purple-800 flex items-center gap-2">
                  <FiKey className="text-purple-600" />
                  {t('admin.layout.superMode')}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {t('admin.layout.fullAccess')}
                </p>
              </div>
            )}
          </div>
          
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
                      {t('admin.layout.super')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
            
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
                  <p className="font-medium text-gray-900">{user?.name || t('admin.layout.admin')}</p>
                  <p className="text-sm text-gray-500">{user?.email || 'admin@ecommerce.bo'}</p>
                  {user?.role === 'superadmin' && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mt-1 inline-block">
                      {t('admin.layout.superAdmin').toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <FiLogOut />
                {t('admin.layout.logout')}
              </button>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              v1.0.0 • {t('admin.layout.subtitle')}
            </p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <FiMenu className="w-6 h-6 text-gray-700" />
              </button>
              
              <div className="hidden md:block">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {allMenuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  {location.pathname === '/admin' && t('admin.layout.descDashboard')}
                  {location.pathname === '/admin/orders' && t('admin.layout.descOrders')}
                  {location.pathname === '/admin/products' && t('admin.layout.descProducts')}
                  {location.pathname === '/admin/customers' && t('admin.layout.descCustomers')}
                  {location.pathname === '/admin/analytics' && t('admin.layout.descAnalytics')}
                  {location.pathname === '/admin/settings' && t('admin.layout.descSettings')}
                  {location.pathname === '/create-invite' && t('admin.layout.descInvites')}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden lg:block relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('admin.layout.searchPlaceholder')}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
                
                {user?.role === 'superadmin' && location.pathname !== '/create-invite' && (
                  <Link
                    to="/create-invite"
                    className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
                  >
                    <FiKey />
                    <span className="font-medium">{t('admin.invites.title')}</span>
                  </Link>
                )}
                
                <LanguageSwitch variant="light" />
                
                <button className="relative p-2 rounded-lg hover:bg-gray-100">
                  <FiBell className="w-6 h-6 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="hidden lg:flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-fuchsia-500 rounded-full">
                    <img 
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=805AD5&color=fff`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{user?.name?.split(' ')[0] || t('admin.layout.admin')}</p>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'superadmin' ? t('admin.layout.superAdmin') : t('admin.layout.admin')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            {user?.role === 'superadmin' && location.pathname !== '/create-invite' && (
              <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <FiKey className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-800">{t('admin.layout.superAdmin')}</h3>
                      <p className="text-sm text-purple-600">
                        {t('admin.layout.bannerText')}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/create-invite"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
                  >
                    <FiKey />
                    {t('admin.layout.goInvites')}
                  </Link>
                </div>
              </div>
            )}
            
            <div key={location.pathname} className="animate-fadeIn">
              <Outlet />
            </div>
          </main>
          
          <footer className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600 mb-2 md:mb-0">
                © 2026 {t('app.name')} {t('app.country')}. {t('admin.layout.rights')}
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600">{t('footer.help')}</a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600">{t('footer.privacy')}</a>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600">{t('footer.terms')}</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;