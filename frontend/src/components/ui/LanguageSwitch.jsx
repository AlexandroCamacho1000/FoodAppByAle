import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitch({ variant = 'dark' }) {
  const { language, toggleLanguage } = useLanguage();

  const isDarkNavbar = variant === 'dark';

  return (
    <button 
      onClick={toggleLanguage}
      className={`relative flex items-center justify-center p-2 rounded-xl border transition-all duration-300 group w-12 h-12 ${
        isDarkNavbar
          ? 'bg-white/10 border-white/20 hover:bg-white/20'
          : 'border-gray-300 bg-white hover:bg-gray-100'
      }`}
      aria-label={`Cambiar idioma a ${language === 'es' ? 'inglés' : 'español'}`}
    >
      <div className="relative w-8 h-8 overflow-hidden">
        <div 
          className={`absolute top-0 left-0 w-8 h-8 flex items-center justify-center transition-transform duration-300 ${
            language === 'es' ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <span className="text-2xl">🇪🇸</span>
        </div>
        
        <div 
          className={`absolute top-0 left-0 w-8 h-8 flex items-center justify-center transition-transform duration-300 ${
            language === 'en' ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <span className="text-2xl">🇺🇸</span>
        </div>
      </div>

      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
        isDarkNavbar ? 'border-2 border-[#1E293B]' : 'border-2 border-white'
      } ${
        language === 'es' ? 'bg-[#D946EF]' : 'bg-[#2563EB]'
      }`}></div>

      <div className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 ${
        isDarkNavbar
          ? 'bg-[#1E293B] text-white border border-[#475569] shadow-xl'
          : 'bg-white text-gray-900 border border-gray-300 shadow-lg'
      }`}>
        {language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${
          isDarkNavbar
            ? 'bg-[#1E293B] border-l border-t border-[#475569]'
            : 'bg-white border-l border-t border-gray-300'
        }`}></div>
      </div>
    </button>
  );
}