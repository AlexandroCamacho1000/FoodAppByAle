// frontend/src/services/productService.js - VERSIÓN SIN DUPLICADOS

// Productos iniciales (solo para PRIMERA carga)
// En tu productService.js, actualiza las imágenes:

const initialProducts = [
  {
    id: 1,
    name: "Salteñas Paceñas",
    description: "Empanadas horneadas rellenas de carne jugosa, papa, arvejas y aceitunas.",
    price: 15,
    category: "Salteñas",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    stock: 50,
    featured: true,
    rating: 4.8,
    prepTime: "25 min",
    isActive: true
  },
  {
    id: 2,
    name: "Anticuchos",
    description: "Brochetas de corazón de res marinadas en ají, comino y especias.",
    price: 28,
    category: "Carnes",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
    stock: 30,
    featured: true,
    rating: 4.9,
    prepTime: "20 min",
    isActive: true
  },
  {
    id: 3,
    name: "Sillpancho Cochabambino",
    description: "Arroz, papa dorada, carne empanizada, huevo frito, salsa criolla.",
    price: 42,
    category: "Platos Fuertes",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop",
    stock: 25,
    featured: true,
    rating: 4.7,
    prepTime: "35 min",
    isActive: true
  },
  {
    id: 4,
    name: "Pique Macho",
    description: "Carne, salchichas, papas fritas, huevo, tomate, cebolla, locoto.",
    price: 55,
    category: "Platos Fuertes",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    stock: 20,
    featured: false,
    rating: 4.9,
    prepTime: "40 min",
    isActive: true
  },
  {
    id: 5,
    name: "Api con Pastel",
    description: "Bebida caliente de maíz morado con canela. Acompañado de pastel frito.",
    price: 12,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop",
    stock: 100,
    featured: false,
    rating: 4.6,
    prepTime: "15 min",
    isActive: true
  },
  {
    id: 6,
    name: "Humintas",
    description: "Tamales dulces de maíz envueltos en chala. Tradición valluna.",
    price: 10,
    category: "Postres",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    stock: 40,
    featured: false,
    rating: 4.5,
    prepTime: "30 min",
    isActive: true
  }
];
// 🔄 FUNCIÓN MEJORADA: Cargar productos SIN DUPLICAR
const loadProductsFromStorage = () => {
  try {
    console.log('🔍 Buscando productos...');
    
    // ESTRATEGIA 1: Productos activos de admin (los que editamos)
    const adminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    
    if (adminProducts.length > 0) {
      console.log(`✅ ${adminProducts.length} productos en admin`);
      
      // Filtrar solo productos ACTIVOS
      const activeProducts = adminProducts
        .filter(product => product.isActive !== false)
        .map(product => ({
          id: product.id || `PROD-${Date.now()}`,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image || '/images/placeholder.jpg',
          featured: product.isFeatured || false,
          stock: product.stock || 0,
          rating: product.rating || 4.5,
          prepTime: product.preparationTime || '30 min'
        }));
      
      return activeProducts;
    }
    
    // ESTRATEGIA 2: ¿Ya inicializamos alguna vez?
    const isInitialized = localStorage.getItem('products_initialized');
    
    if (!isInitialized) {
      console.log('📦 Primera carga: inicializando productos...');
      
      // Guardar productos iniciales SOLO UNA VEZ
      localStorage.setItem('admin_products', JSON.stringify(initialProducts));
      localStorage.setItem('products_initialized', 'true');
      
      return initialProducts;
    }
    
    // ESTRATEGIA 3: Cargar de menu_products (fallback)
    const menuProducts = JSON.parse(localStorage.getItem('menu_products') || '[]');
    if (menuProducts.length > 0) {
      console.log(`✅ ${menuProducts.length} productos en menu`);
      return menuProducts;
    }
    
    // ESTRATEGIA 4: Devolver array vacío si no hay nada
    console.log('📭 No hay productos disponibles');
    return [];
    
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    return [];
  }
};

// 🔄 FUNCIÓN: Sincronizar productos desde Admin a Menu
export const syncProductsToMenu = () => {
  try {
    console.log('🔄 Sincronizando productos...');
    
    const adminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    
    if (adminProducts.length === 0) return false;
    
    // Filtrar solo productos activos
    const activeProducts = adminProducts
      .filter(product => product.isActive !== false)
      .map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image || '/images/placeholder.jpg',
        featured: product.isFeatured || false,
        stock: product.stock || 0,
        rating: product.rating || 4.5,
        prepTime: product.preparationTime || '30 min'
      }));
    
    // Guardar productos activos para Menu.jsx
    localStorage.setItem('menu_products', JSON.stringify(activeProducts));
    localStorage.setItem('products_last_update', Date.now().toString());
    
    // Disparar evento
    window.dispatchEvent(new Event('products-updated'));
    
    console.log(`✅ ${activeProducts.length} productos sincronizados`);
    return true;
    
  } catch (error) {
    console.error('❌ Error sincronizando:', error);
    return false;
  }
};

// 🔥 FUNCIÓN: Obtener productos por categoría
const getProductsByCategoryImpl = async (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = loadProductsFromStorage();
      const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
      resolve(filtered);
    }, 300);
  });
};

// Servicio de productos
export const productService = {
  getProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(loadProductsFromStorage());
      }, 300);
    });
  },
  
  getProductById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const products = loadProductsFromStorage();
        const product = products.find(p => p.id.toString() === id.toString());
        product ? resolve(product) : reject(new Error('No encontrado'));
      }, 300);
    });
  },
  
  getFeaturedProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = loadProductsFromStorage();
        resolve(products.filter(p => p.featured).slice(0, 4));
      }, 300);
    });
  },
  
  getProductsByCategory: getProductsByCategoryImpl,
  
  syncProducts: syncProductsToMenu,
  
  saveProducts: (products) => {
    try {
      localStorage.setItem('admin_products', JSON.stringify(products));
      console.log(`💾 ${products.length} productos guardados`);
      syncProductsToMenu();
      return true;
    } catch (error) {
      console.error('❌ Error guardando:', error);
      return false;
    }
  }
};

// Exportar funciones
export const getProducts = productService.getProducts;
export const getProductById = productService.getProductById;
export const getFeaturedProducts = productService.getFeaturedProducts;
export const getProductsByCategory = productService.getProductsByCategory;
export const syncProducts = productService.syncProducts;
export const saveProducts = productService.saveProducts;