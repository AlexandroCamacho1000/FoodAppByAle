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
      // Navegación
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
      category: 'Categoría',
      price: 'Precio',
      
      // App
      'app.name': 'Sabores',
      'app.country': 'Bolivia', 
      'app.tagline': 'Tecnología y tradición',
      logout: 'Cerrar sesión',
      account: 'Cuenta',
      myProfile: 'Mi perfil',
      
      // Categorías
      'categories.saltenas': 'Salteñas',
      'categories.anticuchos': 'Anticuchos',
      'categories.platos': 'Platos de Fondo',
      'categories.carnes': 'Carnes',
      'categories.bebidas': 'Bebidas',
      'categories.entradas': 'Entradas',
      'categories.bebidastradicionales': 'Bebidas Tradicionales',
  'categories.postresyentradas': 'Postres y Entradas',
      
      // Productos
      'products.saltenas.name': 'Salteñas Paceñas',
      'products.saltenas.description': 'Empanadas horneadas rellenas de carne jugosa, papa, arvejas y aceitunas.',
      'products.anticuchos.name': 'Anticuchos',
      'products.anticuchos.description': 'Brochetas de corazón de res marinadas en ají, comino y especias. A la parrilla.',
      'products.silpancho.name': 'Sillpancho Cochabambino',
      'products.silpancho.description': 'Arroz, papa dorada, carne empanizada, huevo frito, salsa criolla y llajwa.',
      'products.pique.name': 'Pique Macho',
      'products.pique.description': 'Carne, salchichas, papas fritas, huevo, tomate, cebolla, locoto y mayonesa.',
      'products.api.name': 'Api con Pastel',
      'products.api.description': 'Bebida caliente de maíz morado con canela. Acompañado de pastel frito.',
      'products.humintas.name': 'Humintas',
      'products.humintas.description': 'Tamales dulces de maíz envueltos en chala. Tradición valluna.',
      
      // Home
      'home.title': 'Comida Tradicional Boliviana',
      'home.subtitle': 'Los auténticos sabores de Bolivia en tu mesa',
      'home.cta': 'Explorar Menú',
      'home.featuredDesc': 'Nuestros platos más populares',
      
      // Footer
      'footer.description': 'Proyecto de portfolio profesional - Tecnología y tradición culinaria',
      'footer.rights': 'Portfolio profesional',
      'footer.terms': 'Términos',
      'footer.privacy': 'Privacidad',
      'footer.contact': 'Contacto',
      
      // Carrito
      'cart.title': 'Tu Carrito',
      'cart.empty': 'Tu carrito está vacío',
      'cart.emptyDescription': 'Agrega algunos productos deliciosos de Bolivia',
      'cart.summary': 'Resumen del Pedido',
      'cart.subtotal': 'Subtotal',
      'cart.shipping': 'Envío',
      'cart.tax': 'Impuestos (13%)',
      'cart.total': 'Total',
      'cart.checkout': 'Proceder al Pago',
      'cart.continue': 'Seguir Comprando',
      'cart.securityInfo': 'Pago seguro con encriptación SSL',
      'cart.alreadyInCart': 'Ya en tu carrito',
      
      // 404
      'notFound.title': 'Página no encontrada',
      'notFound.description': 'La página que buscas no existe o ha sido movida.',
      'notFound.goHome': 'Volver al inicio',

      'menu.description': 'Descubre los auténticos sabores de Bolivia',
  'menu.filterByCategory': 'Filtrar por categoría',
  'menu.previous': 'Anterior',
  'menu.next': 'Siguiente',

      
    },
    en: {
      // Navigation
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
      category: 'Category',
      price: 'Price',
      
      // App
      'app.name': 'Flavors',
      'app.country': 'Bolivia',
      'app.tagline': 'Technology and tradition',
      logout: 'Logout',
      account: 'Account',
      myProfile: 'My Profile',
      
      // Categories
      'categories.saltenas': 'Salteñas',
      'categories.anticuchos': 'Anticuchos',
      'categories.platos': 'Main Dishes',
      'categories.carnes': 'Meats',
      'categories.bebidas': 'Drinks',
      'categories.entradas': 'Appetizers',
       'categories.bebidastradicionales': 'Traditional Drinks',
  'categories.postresyentradas': 'Desserts & Appetizers',
      
      // Products
      'products.saltenas.name': 'Salteñas Paceñas',
      'products.saltenas.description': 'Baked empanadas filled with juicy meat, potatoes, peas and olives.',
      'products.anticuchos.name': 'Anticuchos',
      'products.anticuchos.description': 'Beef heart skewers marinated in chili, cumin and spices. Grilled.',
      'products.silpancho.name': 'Sillpancho Cochabambino',
      'products.silpancho.description': 'Rice, golden potatoes, breaded meat, fried egg, creole sauce and llajwa.',
      'products.pique.name': 'Pique Macho',
      'products.pique.description': 'Meat, sausages, french fries, egg, tomato, onion, locoto and mayonnaise.',
      'products.api.name': 'Api with Pastel',
      'products.api.description': 'Hot purple corn drink with cinnamon. Accompanied by fried pastry.',
      'products.humintas.name': 'Humintas',
      'products.humintas.description': 'Sweet corn tamales wrapped in corn husks. Valluno tradition.',
      
      // Home
      'home.title': 'Traditional Bolivian Food',
      'home.subtitle': 'The authentic flavors of Bolivia at your table',
      'home.cta': 'Explore Menu',
      'home.featuredDesc': 'Our most popular dishes',
      
      // Footer
      'footer.description': 'Professional portfolio project - Technology and culinary tradition',
      'footer.rights': 'Professional portfolio',
      'footer.terms': 'Terms',
      'footer.privacy': 'Privacy',
      'footer.contact': 'Contact',
      
      // Cart
      'cart.title': 'Your Cart',
      'cart.empty': 'Your cart is empty',
      'cart.emptyDescription': 'Add some delicious Bolivian products',
      'cart.summary': 'Order Summary',
      'cart.subtotal': 'Subtotal',
      'cart.shipping': 'Shipping',
      'cart.tax': 'Tax (13%)',
      'cart.total': 'Total',
      'cart.checkout': 'Proceed to Checkout',
      'cart.continue': 'Continue Shopping',
      'cart.securityInfo': 'Secure payment with SSL encryption',
      'cart.alreadyInCart': 'Already in your cart',
      
      // 404
      'notFound.title': 'Page not found',
      'notFound.description': 'The page you are looking for does not exist or has been moved.',
      'notFound.goHome': 'Back to home',
      // AÑADE ESTAS NUEVAS:
  'menu.description': 'Discover the authentic flavors of Bolivia',
  'menu.filterByCategory': 'Filter by category',
  'menu.previous': 'Previous',
  'menu.next': 'Next',
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