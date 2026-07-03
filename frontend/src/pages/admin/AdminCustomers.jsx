import React, { useState, useEffect } from 'react';
import { FiUsers, FiMail, FiCalendar, FiUser, FiEdit, FiTrash2, FiFilter } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const AdminCustomers = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    const users = JSON.parse(localStorage.getItem('bolivian_market_users') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    // Calcular estadísticas por usuario desde las órdenes
    const orderStats = {};
    orders.forEach(o => {
      const uid = o.userId;
      if (!uid) return;
      if (!orderStats[uid]) {
        orderStats[uid] = { orders: 0, totalSpent: 0 };
      }
      orderStats[uid].orders += 1;
      orderStats[uid].totalSpent += o.total || 0;
    });

    const exampleCustomers = users.length === 0 ? [
      {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        phone: '+591 71234567',
        role: 'user',
        avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=0BC5EA&color=fff',
        createdAt: '2024-01-15',
        orders: 5,
        totalSpent: 1250
      },
      {
        id: '2',
        name: 'María García',
        email: 'maria@ejemplo.com',
        phone: '+591 68765432',
        role: 'user',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=ED8936&color=fff',
        createdAt: '2024-01-20',
        orders: 3,
        totalSpent: 850
      },
      {
        id: '3',
        name: 'Carlos López',
        email: 'carlos@ejemplo.com',
        phone: '+591 79988776',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=805AD5&color=fff',
        createdAt: '2024-01-10',
        orders: 12,
        totalSpent: 3250
      }
    ] : users.map(u => ({
      ...u,
      orders: orderStats[u.id]?.orders || 0,
      totalSpent: orderStats[u.id]?.totalSpent || 0
    }));

    setCustomers(exampleCustomers);
    setFilteredCustomers(exampleCustomers);
    setLoading(false);
  };

  useEffect(() => {
    let result = customers;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.phone?.includes(term)
      );
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(c => c.role === roleFilter);
    }
    
    setFilteredCustomers(result);
  }, [searchTerm, roleFilter, customers]);

  const handleRoleColor = (role) => {
    switch(role) {
      case 'superadmin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handleRoleLabel = (role) => {
    switch(role) {
      case 'superadmin': return 'Super Admin';
      case 'admin': return 'Admin';
      default: return 'Cliente';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <FiUsers className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('admin.customers.title')}</h1>
            <p className="text-gray-600">
              {t('app.lang') === 'es' 
                ? `Total: ${filteredCustomers.length} clientes` 
                : `Total: ${filteredCustomers.length} customers`}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('app.lang') === 'es' ? 'Buscar por nombre, email o teléfono...' : 'Search by name, email or phone...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">
                  {t('app.lang') === 'es' ? 'Todos los roles' : 'All roles'}
                </option>
                <option value="user">
                  {t('app.lang') === 'es' ? 'Clientes' : 'Clients'}
                </option>
                <option value="admin">
                  {t('app.lang') === 'es' ? 'Administradores' : 'Admins'}
                </option>
                <option value="superadmin">
                  {t('app.lang') === 'es' ? 'Super Admin' : 'Super Admin'}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                  {t('app.lang') === 'es' ? 'Cliente' : 'Customer'}
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{t('app.lang') === 'es' ? 'Email' : 'Email'}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{t('app.lang') === 'es' ? 'Teléfono' : 'Phone'}</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">{t('app.lang') === 'es' ? 'Rol' : 'Role'}</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">{t('app.lang') === 'es' ? 'Pedidos' : 'Orders'}</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">{t('app.lang') === 'es' ? 'Total Gastado' : 'Total Spent'}</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">{t('app.lang') === 'es' ? 'Registro' : 'Registered'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=0BC5EA&color=fff`}
                        alt={customer.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        {customer.orders > 0 && (
                          <p className="text-xs text-gray-500">
                            {customer.orders} {t('app.lang') === 'es' ? 'compras' : 'purchases'}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gray-400 w-4 h-4" />
                      <span className="text-sm text-gray-600">{customer.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${handleRoleColor(customer.role)}`}>
                      {handleRoleLabel(customer.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">{customer.orders || 0}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    Bs. {(customer.totalSpent || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-center">
                      <FiCalendar className="text-gray-400 w-4 h-4" />
                      <span className="text-sm text-gray-600">
                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-16">
            <FiUsers className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('app.lang') === 'es' ? 'No se encontraron clientes' : 'No customers found'}
            </h3>
            <p className="text-gray-500">
              {t('app.lang') === 'es' 
                ? 'Intenta ajustar los filtros de búsqueda' 
                : 'Try adjusting the search filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;