// frontend/src/components/layout/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import LanguageSwitch from '../ui/LanguageSwitch';

export default function Navbar() {
  const { t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart(); // ← Cambiado de cartItems a cart
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-[#1E293B] to-[#334155] text-white shadow-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#D946EF] rounded-lg flex items-center justify-center">
                  <span className="text-xl">🥘</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#D946EF] rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold whitespace-nowrap">
                  {t('app.name')} <span className="text-[#60A5FA]">{t('app.country')}</span>
                </h1>
                <p className="text-xs text-[#94A3B8] whitespace-nowrap">{t('app.tagline')}</p>
              </div>
            </Link>
          </div>
          
          {/* Navegación */}
          <div className="flex items-center gap-4 w-[500px] justify-end">
            {/* Language Switch */}
            <div className="w-14 flex-shrink-0">
              <LanguageSwitch />
            </div>
            
            {/* Menú */}
            <Link 
              to="/menu" 
              className="text-[#CBD5E1] hover:text-white hover:border-b-2 hover:border-[#60A5FA] pb-1 transition-all w-16 text-center"
            >
              {t('menu')}
            </Link>
            
            {/* Carrito con contador - CORREGIDO */}
            <Link 
              to="/cart" 
              className="relative text-[#CBD5E1] hover:text-white hover:border-b-2 hover:border-[#60A5FA] pb-1 transition-all w-20 text-center"
            >
              <span className="relative">
                {t('cart')}
                {cart?.length > 0 && ( // ← Agregado ?. para seguridad
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length} {/* ← Ahora usa cart en lugar de cartItems */}
                  </span>
                )}
              </span>
            </Link>
            
            {/* Dropdown de cuenta - SOLO SI HAY USUARIO */}
            {user ? (
              <div className="relative w-24" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-[#CBD5E1] hover:text-white flex items-center justify-center gap-1 w-full"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-6 h-6 rounded-full mr-1 border border-white"
                  />
                  <span className="truncate text-sm">{user.name.split(' ')[0]}</span>
                  <span className={`text-xs flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute bg-[#1E293B] border border-[#475569] rounded-lg mt-2 p-2 w-full z-50 shadow-xl min-w-[180px] right-0">
                    {/* Info del usuario */}
                    <div className="px-2 py-1 mb-2 border-b border-[#475569]">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-[#94A3B8] truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded mt-1 inline-block">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    <Link 
                      to="/profile" 
                      className="text-[#60A5FA] text-sm p-2 hover:bg-[#334155] rounded text-left block mb-1 w-full flex items-center"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="mr-2">👤</span>
                      {t('myProfile')}
                    </Link>
                    
                    <Link 
                      to="/my-orders" 
                      className="text-[#60A5FA] text-sm p-2 hover:bg-[#334155] rounded text-left block mb-1 w-full flex items-center"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="mr-2">📦</span>
                      Mis Pedidos
                    </Link>
                    
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="bg-yellow-500/20 text-yellow-300 text-sm p-2 hover:bg-yellow-500/30 rounded text-left block mb-1 w-full flex items-center font-semibold"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="mr-2">⚙️</span>
                        Panel Admin
                      </Link>
                    )}
                    
                    <div className="border-t border-[#475569] my-2"></div>
                    
                    <button 
                      className="text-[#D946EF] text-sm p-2 hover:bg-[#334155] rounded text-left w-full flex items-center"
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="mr-2">🚪</span>
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* SI NO HAY USUARIO: Mostrar botón de Login */
              <Link 
                to="/login"
                className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#D946EF]/20 transition-all w-32 py-2 text-center font-medium"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}