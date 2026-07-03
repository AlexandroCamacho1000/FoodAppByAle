import { createContext, useState, useEffect, useContext } from 'react';
import localeData from '../locales/index';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('sabores_language');
    if (saved && ['es', 'en'].includes(saved)) return saved;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'es';
  });

  const [translations, setTranslations] = useState({});

  useEffect(() => {
    localStorage.setItem('sabores_language', language);
    document.documentElement.lang = language;
    setTranslations(localeData[language]);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (key, params = {}) => {
    let text = translations[key] || key;
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}