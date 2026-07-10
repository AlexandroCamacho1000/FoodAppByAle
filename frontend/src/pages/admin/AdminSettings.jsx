// frontend/src/pages/admin/AdminSettings.jsx
import { useState } from 'react';
import { FiSettings, FiSave, FiBell, FiGlobe, FiShield, FiCreditCard, FiMail } from 'react-icons/fi';
import Toast from '../../components/ui/Toast';

const AdminSettings = () => {
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [settings, setSettings] = useState({
    storeName: 'Bolivian Market',
    storeEmail: 'info@bolivianmarket.com',
    storePhone: '+591 71234567',
    currency: 'BOB',
    timezone: 'America/La_Paz',
    notifications: true,
    emailNotifications: true,
    lowStockAlert: true,
    autoBackup: false,
    maintenanceMode: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setToastMessage('Configuración guardada correctamente');
    setToastType('success');
    setToastShow(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
            <FiSettings className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configuración</h1>
            <p className="text-gray-600 dark:text-gray-400">Configuración general del sistema</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda - Configuración general */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información de la tienda */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiGlobe className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Información de la Tienda</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-[#475569] dark:bg-[#1e293b] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email de Contacto
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      name="storeEmail"
                      value={settings.storeEmail}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-[#475569] dark:bg-[#1e293b] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="storePhone"
                    value={settings.storePhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#475569] dark:bg-[#1e293b] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Moneda
                  </label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#475569] dark:bg-[#1e293b] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="BOB">Boliviano (BOB)</option>
                    <option value="USD">Dólar (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zona Horaria
                  </label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#475569] dark:bg-[#1e293b] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="America/La_Paz">La Paz, Bolivia (GMT-4)</option>
                    <option value="America/Santa_Cruz">Santa Cruz, Bolivia (GMT-4)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración de notificaciones */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiBell className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notificaciones</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Notificaciones en Sistema</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recibir notificaciones dentro del panel</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-[#475569] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-[#475569] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Notificaciones por Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recibir notificaciones por correo electrónico</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-[#475569] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-[#475569] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Alertas de Stock Bajo</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recibir alertas cuando el stock sea bajo</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="lowStockAlert"
                    checked={settings.lowStockAlert}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-[#475569] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-[#475569] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Configuración avanzada */}
        <div className="space-y-6">
          {/* Configuración de seguridad */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiShield className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Seguridad</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Backup Automático</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Realizar backup automático diario</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="autoBackup"
                    checked={settings.autoBackup}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-[#475569] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-[#475569] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Modo Mantenimiento</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Activar modo mantenimiento del sitio</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-[#475569] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-[#475569] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Métodos de pago */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiCreditCard className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Métodos de Pago</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-100">Tarjetas de Crédito/Débito</span>
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-100">Transferencia Bancaria</span>
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-100">Pago en Efectivo</span>
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-gray-100">PayPal</span>
                <span className="text-gray-400 dark:text-gray-500 text-sm">Inactivo</span>
              </div>
            </div>
          </div>

          {/* Botón guardar */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-[#334155] p-6">
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <FiSave />
              Guardar Configuración
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
              Los cambios se aplicarán inmediatamente
            </p>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiSettings className="text-blue-600 dark:text-blue-400 mt-1" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Configuración del Sistema</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Esta página permite configurar todas las opciones del sistema. En una implementación 
              completa, los cambios se guardarían en una base de datos y se aplicarían a todo el sitio.
            </p>
          </div>
        </div>
      </div>
      <Toast message={toastMessage} type={toastType} show={toastShow} onClose={() => setToastShow(false)} />
    </div>
  );
};

export default AdminSettings;