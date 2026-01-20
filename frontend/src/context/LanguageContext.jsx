import { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('sabores_language');
    if (saved && ['es', 'en'].includes(saved)) return saved;
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'es';
  });

  useEffect(() => {
    localStorage.setItem('sabores_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const translations = {
    es: {
      menu: 'Menú',
      cart: 'Carrito',
      login: 'Iniciar Sesión',
      profile: 'Perfil',
      home: 'Inicio',
      about: 'Sobre Nosotros',
      contact: 'Contacto',
      search: 'Buscar',
      addToCart: 'Añadir al Carrito',
      viewAll: 'Ver Todo',
      featured: 'Destacados',
      'app.name': 'Sabores',
      'app.country': 'Bolivia', 
      'app.tagline': 'Tecnología y tradición',
      logout: 'Cerrar sesión',
      account: 'Cuenta',
      myProfile: 'Mi perfil',
      // NUEVAS PARA PRODUCTOS:
      category: 'Categoría',
      price: 'Precio',
      'categories.saltenas': 'Salteñas',
      'categories.anticuchos': 'Anticuchos',
      'categories.platos': 'Platos de Fondo',
      'products.saltenas.name': 'Salteñas Paceñas',
      'products.saltenas.description': 'Empanadas horneadas rellenas de carne jugosa, papa, arvejas y aceitunas.',
      'home.title': 'Comida Tradicional Boliviana',
  'home.subtitle': 'Los auténticos sabores de Bolivia en tu mesa',
  'home.cta': 'Explorar Menú',
  'home.featuredDesc': 'Nuestros platos más populares',
  'footer.description': 'Proyecto de portfolio profesional - Tecnología y tradición culinaria',
  'footer.rights': 'Portfolio profesional',
  'footer.terms': 'Términos',
  'footer.privacy': 'Privacidad',
  'footer.contact': 'Contacto',
    },
    en: {
      menu: 'Menu',
      cart: 'Cart',
      login: 'Login',
      profile: 'Profile',
      home: 'Home',
      about: 'About Us',
      contact: 'Contact',
      search: 'Search',
      addToCart: 'Add to Cart',
      viewAll: 'View All',
      featured: 'Featured',
      'app.name': 'Flavors',
      'app.country': 'Bolivia',
      'app.tagline': 'Technology and tradition',
      logout: 'Logout',
      account: 'Account',
      myProfile: 'My Profile',
      // NUEVAS PARA PRODUCTOS:
      category: 'Category',
      price: 'Price',
      'categories.saltenas': 'Salteñas',
      'categories.anticuchos': 'Anticuchos',
      'categories.platos': 'Main Dishes',
      'products.saltenas.name': 'Salteñas Paceñas',
      'products.saltenas.description': 'Baked empanadas filled with juicy meat, potatoes, peas and olives.',
      'home.title': 'Traditional Bolivian Food',
  'home.subtitle': 'The authentic flavors of Bolivia at your table',
  'home.cta': 'Explore Menu',
  'home.featuredDesc': 'Our most popular dishes',
  'footer.description': 'Professional portfolio project - Technology and culinary tradition',
  'footer.rights': 'Professional portfolio',
  'footer.terms': 'Terms',
  'footer.privacy': 'Privacy',
  'footer.contact': 'Contact',
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      toggleLanguage, 
      t 
    }}>
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