// D:\CURSO REACT\projects-react\food-app\frontend\src\hooks\useLanguage.js
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    console.warn('⚠️ LanguageContext no encontrado. Asegúrate de que el componente esté dentro de LanguageProvider');
    return {
      language: 'es',
      setLanguage: () => {},
      translations: {},
      t: (key) => key,
      isEnglish: false,
      isSpanish: true
    };
  }
  
  return {
    language: context.language,
    setLanguage: context.setLanguage,
    translations: context.translations,
    t: context.t || ((key) => key),
    isEnglish: context.language === 'en',
    isSpanish: context.language === 'es'
  };
};

export default useLanguage;