import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import LanguageSwitch from '../ui/LanguageSwitch';
import { useDarkMode } from '../../context/DarkModeContext';

export default function Navbar() {
  const { t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const { dark, toggle: toggleDark } = useDarkMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`bg-gradient-to-r from-[#1E293B] to-[#334155] text-white sticky top-0 z-50 transition-shadow duration-300 ${
      scrolled ? 'shadow-xl' : 'shadow-none'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="animate-float w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#D946EF] rounded-lg flex items-center justify-center p-1">
                  <img src="/logoaledev26.png" alt="AleSoft" className="w-full h-full object-contain" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-fuchsia-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block flex-shrink-0">
                <h1 className="text-lg md:text-xl font-bold whitespace-nowrap">
                  {t('app.name')} <span className="text-blue-400">{t('app.country')}</span>
                </h1>
                <p className="hidden md:block text-xs text-gray-400 whitespace-nowrap">{t('app.tagline')}</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6 justify-end flex-1 min-w-0">
            <div className="flex-shrink-0 scale-75 md:scale-100 origin-right">
              <LanguageSwitch />
            </div>

            <button
              onClick={toggleDark}
              className="text-gray-300 hover:text-white transition-colors text-lg flex-shrink-0"
              aria-label={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? '☀️' : '🌙'}
            </button>
            
            <Link 
              to="/menu" 
              className="hidden sm:flex text-gray-300 hover:text-white relative pb-1 transition-colors text-sm text-center group min-w-[48px] justify-center"
            >
             {t('nav.menu')}
             <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
            </Link>
            
            <Link 
              to="/cart" 
              className="relative text-gray-300 hover:text-white pb-1 transition-all text-sm text-center group flex-shrink-0"
            >
              <span className="relative flex items-center gap-1">
                 <span className="text-sm md:text-base">🛒</span>
                  <span className="hidden md:inline min-w-[56px] text-left">{t('nav.cart')}</span>
                {cart?.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-bounceIn">
                    {cart.length}
                  </span>
                )}
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
            </Link>
            
            {user ? (
              <div className="relative flex-shrink-0" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-gray-300 hover:text-white flex items-center justify-center gap-1"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name || 'User'}
                    className="w-6 h-6 rounded-full border border-white flex-shrink-0"
                  />
                  <span className="hidden md:inline truncate text-sm max-w-[80px]">{user.name.split(' ')[0]}</span>
                  <span className={`hidden md:inline text-xs flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                <div className={`absolute bg-[#1E293B] border border-gray-600 rounded-lg mt-2 p-2 z-50 shadow-xl min-w-[180px] right-0 transition-all duration-200 ${
                  isDropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                }`}>
                  <div className="px-2 py-1 mb-2 border-b border-gray-600">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded mt-1 inline-block">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/admin');
                      }}
                      className="bg-yellow-500/20 text-yellow-300 text-sm p-2 hover:bg-yellow-500/30 rounded text-left block mb-1 w-full flex items-center font-semibold"
                    >
                      <span className="mr-2">⚙️</span>
                      {t('nav.admin')}
                    </button>
                  )}
                  
                  {user?.role === 'superadmin' && (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/create-invite');
                      }}
                      className="bg-purple-500/20 text-purple-300 text-sm p-2 hover:bg-purple-500/30 rounded text-left block mb-1 w-full flex items-center font-semibold border-l-4 border-purple-500"
                    >
                      <span className="mr-2">🔑</span>
                      {t('nav.invites')}
                      <span className="ml-auto text-xs bg-purple-700 px-1 rounded">SUPER</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/profile');
                    }}
                    className="text-blue-400 text-sm p-2 hover:bg-[#334155] rounded text-left block mb-1 w-full flex items-center"
                  >
                    <span className="mr-2">👤</span>
                    {t('nav.profile')}
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/my-orders');
                    }}
                    className="text-blue-400 text-sm p-2 hover:bg-[#334155] rounded text-left block mb-1 w-full flex items-center"
                  >
                    <span className="mr-2">📦</span>
                    {t('nav.myOrders')}
                  </button>
                  
                  <div className="border-t border-gray-600 my-2"></div>
                  
                  <button 
                    className="text-fuchsia-400 text-sm p-2 hover:bg-[#334155] rounded text-left w-full flex items-center"
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className="mr-2">🚪</span>
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all duration-300 px-3 md:px-5 py-2 text-xs md:text-sm text-center font-medium whitespace-nowrap flex-shrink-0"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}