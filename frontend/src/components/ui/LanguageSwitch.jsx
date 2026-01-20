import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitch() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      onClick={toggleLanguage}
      className="relative flex items-center justify-center p-2 rounded-lg border border-[#475569] bg-[#1E293B] hover:bg-[#334155] transition-all duration-300 group w-12 h-12"
      aria-label={`Cambiar idioma a ${language === 'es' ? 'inglés' : 'español'}`}
    >
      {/* Contenedor para animación suave */}
      <div className="relative w-8 h-8 overflow-hidden">
        {/* Bandera ES - se desliza */}
        <div 
          className={`absolute top-0 left-0 w-8 h-8 flex items-center justify-center transition-transform duration-300 ${
            language === 'es' ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <span className="text-2xl">🇪🇸</span>
        </div>
        
        {/* Bandera EN - se desliza */}
        <div 
          className={`absolute top-0 left-0 w-8 h-8 flex items-center justify-center transition-transform duration-300 ${
            language === 'en' ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <span className="text-2xl">🇺🇸</span>
        </div>
      </div>

      {/* Indicador de cambio (punto fucsia) */}
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1E293B] transition-all duration-300 ${
        language === 'es' ? 'bg-[#2563EB]' : 'bg-[#D946EF]'
      }`}></div>

      {/* Tooltip */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-[#1E293B] text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#475569] z-50">
        {language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#1E293B] border-l border-t border-[#475569] rotate-45"></div>
      </div>
    </button>
  );
}