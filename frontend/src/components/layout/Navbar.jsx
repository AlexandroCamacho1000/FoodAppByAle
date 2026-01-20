import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitch from '../ui/LanguageSwitch';

export default function Navbar() {
  const { t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            
            <Link 
              to="/menu" 
              className="text-[#CBD5E1] hover:text-white hover:border-b-2 hover:border-[#60A5FA] pb-1 transition-all w-16 text-center"
            >
              {t('menu')}
            </Link>
            
            <Link 
              to="/cart" 
              className="text-[#CBD5E1] hover:text-white hover:border-b-2 hover:border-[#60A5FA] pb-1 transition-all w-20 text-center"
            >
              {t('cart')}
            </Link>
            
            {/* Dropdown de cuenta - CON CLICK */}
            <div className="relative w-24">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-[#CBD5E1] hover:text-white flex items-center justify-center gap-1 w-full"
              >
                <span className="truncate">{t('account')}</span>
                <span className={`text-xs flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute bg-[#1E293B] border border-[#475569] rounded-lg mt-2 p-2 w-full z-50 shadow-xl">
                  <Link 
                    to="/profile" 
                    className="text-[#60A5FA] text-sm p-2 hover:bg-[#334155] rounded text-center block mb-1"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {t('myProfile')}
                  </Link>
                  <button 
                    className="text-[#D946EF] text-sm p-2 hover:bg-[#334155] rounded text-center w-full"
                    onClick={() => {
                      // Lógica de logout aquí
                      setIsDropdownOpen(false);
                    }}
                  >
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
            
            {/* Botón login */}
            <Link 
              to="/login"
              className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-lg hover:shadow-lg hover:shadow-[#D946EF]/20 transition-all w-32 py-2 text-center font-medium"
            >
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}