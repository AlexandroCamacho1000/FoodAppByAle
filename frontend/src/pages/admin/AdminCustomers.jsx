import React, { useState } from 'react';
import { FiUsers, FiMail, FiCalendar, FiUser, FiEdit, FiTrash2, FiFilter } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const AdminCustomers = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [customers] = useState(() => {
    const users = JSON.parse(localStorage.getItem('bolivian_market_users') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

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

    if (users.length > 0) {
      return users.map(u => ({
        ...u,
        orders: orderStats[u.id]?.orders || 0,
        totalSpent: orderStats[u.id]?.totalSpent || 0
      }));
    }

    return [
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
    ];
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = !searchTerm ||
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleColor = (role) => {
    switch(role) {
      case 'superadmin': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'admin': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
    }
  };

  const handleRoleLabel = (role) => {
    switch(role) {
      case 'superadmin': return 'Super Admin';
      case 'admin': return 'Admin';
      default: return 'Cliente';
    }
  };

  return (
    <div className="p-4 sm:p-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <FiUsers className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('admin.customers.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400">
                {language === 'es' 
                ? `Total: ${filteredCustomers.length} clientes` 
                : `Total: ${filteredCustomers.length} customers`}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-[#334155] mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-[#334155]">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-0 sm:min-w-[250px] w-full">
              <div className="relative">
                <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                                    placeholder={language === 'es' ? 'Buscar por nombre, email o teléfono...' : 'Search by name, email or phone...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#475569] rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400 dark:text-gray-500" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 dark:border-[#475569] rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">
                {language === 'es' ? 'Todos los roles' : 'All roles'}
                </option>
                <option value="user">
                  {language === 'es' ? 'Clientes' : 'Clients'}
                </option>
                <option value="admin">
                {language === 'es' ? 'Administradores' : 'Admins'}
                </option>
                <option value="superadmin">
                  Super Admin
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#0f172a]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    {language === 'es' ? 'Cliente' : 'Customer'}
                </th>
                   <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Email</th>
                   <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">{language === 'es' ? 'Teléfono' : 'Phone'}</th>
                   <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">{language === 'es' ? 'Rol' : 'Role'}</th>
                   <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">{language === 'es' ? 'Pedidos' : 'Orders'}</th>
                   <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">{language === 'es' ? 'Total Gastado' : 'Total Spent'}</th>
                   <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">{language === 'es' ? 'Registro' : 'Registered'}</th>      
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#334155]">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={customer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=0BC5EA&color=fff`}
                        alt={customer.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
                        {customer.orders > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {customer.orders} {language === 'es' ? 'compras' : 'purchases'}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gray-400 dark:text-gray-500 w-4 h-4" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{customer.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${handleRoleColor(customer.role)}`}>
                      {handleRoleLabel(customer.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-gray-100">{customer.orders || 0}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                    Bs. {(customer.totalSpent || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-center">
                      <FiCalendar className="text-gray-400 dark:text-gray-500 w-4 h-4" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
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
            <FiUsers className="mx-auto text-gray-400 dark:text-gray-500 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {language === 'es' ? 'No se encontraron clientes' : 'No customers found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
               {language === 'es' 
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