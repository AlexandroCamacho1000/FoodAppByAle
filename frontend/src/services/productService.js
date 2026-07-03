// frontend/src/services/productService.js - VERSIÓN CON BACKEND + FALLBACK

import api from './api';

// Productos iniciales (fallback)
const initialProducts = [
  {
    id: 1,
    name: "Salteñas Paceñas",
    description: "Empanadas horneadas rellenas de carne jugosa, papa, arvejas y aceitunas.",
    descriptionEn: "Baked empanadas filled with juicy beef, potatoes, peas and olives.",
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
    descriptionEn: "Beef heart skewers marinated in chili, cumin and spices.",
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
    descriptionEn: "Rice, golden potatoes, breaded beef, fried egg, criollo sauce.",
    price: 42,
    category: "Platos Fuertes",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop",
    stock: 25,
    featured: true,
    rating: 4.7,
    prepTime: "35 min",
    isActive: true
  }
];

// 🔄 FUNCIÓN: Cargar productos (BACKEND PRIMERO, luego fallback)
const loadProductsFromBackend = async () => {
  try {
    console.log('🌐 Intentando conectar con backend...');
    
    // PRIMERO: Intentar conectar al backend
    const response = await api.get('/products');
    console.log('✅ Backend conectado, productos recibidos:', response.data);
    
    // Transformar productos del backend si es necesario
    const backendProducts = response.data.products || response.data;
    
    // Guardar en localStorage como caché
    localStorage.setItem('backend_products_cache', JSON.stringify(backendProducts));
    localStorage.setItem('products_source', 'backend');
    
    return Array.isArray(backendProducts) ? backendProducts : [backendProducts];
    
  } catch (error) {
    console.log('⚠️ Backend no disponible, usando datos locales');
    
    // SEGUNDO: Intentar cargar productos locales
    try {
      const cachedProducts = JSON.parse(localStorage.getItem('backend_products_cache') || '[]');
      if (cachedProducts.length > 0) {
        console.log('📦 Usando caché de productos:', cachedProducts.length);
        localStorage.setItem('products_source', 'cache');
        return cachedProducts;
      }
    } catch (cacheError) {
      console.log('⚠️ Caché no disponible');
    }
    
    // TERCERO: Cargar productos iniciales
    console.log('📋 Usando productos iniciales');
    localStorage.setItem('products_source', 'initial');
    return initialProducts;
  }
};

// 🔄 FUNCIÓN: Obtener productos por categoría
const getProductsByCategoryImpl = async (category) => {
  const products = await loadProductsFromBackend();
  const filtered = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);
  return filtered;
};

// 🎯 SERVICIO PRINCIPAL
export const productService = {
  // Obtener todos los productos
  getProducts: async () => {
    console.log('📡 ProductService: Obteniendo productos...');
    return await loadProductsFromBackend();
  },
  
  // Obtener producto por ID
  getProductById: async (id) => {
    console.log(`🔍 Buscando producto ID: ${id}`);
    
    // PRIMERO: Intentar backend
    try {
      const response = await api.get(`/products/${id}`);
      console.log('✅ Producto encontrado en backend:', response.data);
      return response.data.product || response.data;
    } catch (error) {
      console.log(`⚠️ Producto ${id} no en backend, buscando localmente...`);
    }
    
    // SEGUNDO: Buscar en datos locales
    const products = await loadProductsFromBackend();
    const product = products.find(p => p.id.toString() === id.toString());
    
    if (product) {
      return product;
    }
    
    throw new Error(`Producto con ID ${id} no encontrado`);
  },
  
  // Obtener productos destacados
  getFeaturedProducts: async () => {
    const products = await loadProductsFromBackend();
    return products.filter(p => p.featured).slice(0, 4);
  },
  
  // Obtener por categoría
  getProductsByCategory: getProductsByCategoryImpl,
  
  // Buscar productos
  searchProducts: async (query) => {
    const products = await loadProductsFromBackend();
    const searchTerm = query.toLowerCase();
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  },
  
  // Sincronizar productos (para admin)
  syncProducts: () => {
    console.log('🔄 ProductService: Sincronizando productos...');
    const adminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    
    if (adminProducts.length > 0) {
      const activeProducts = adminProducts.filter(p => p.isActive !== false);
      localStorage.setItem('menu_products', JSON.stringify(activeProducts));
      return true;
    }
    return false;
  },
  
  // Guardar productos (admin)
  saveProducts: (products) => {
    console.log(`💾 Guardando ${products.length} productos en admin`);
    localStorage.setItem('admin_products', JSON.stringify(products));
    
    try {
      // api.post('/admin/products/bulk', { products });
    } catch (error) {
      console.log('⚠️ No se pudo sincronizar con backend');
    }
    
    return true;
  },
  
  // Método para verificar conexión con backend
  checkBackendConnection: async () => {
    try {
      const response = await api.get('/health');
      return {
        connected: true,
        message: 'Backend conectado',
        data: response.data
      };
    } catch (error) {
      return {
        connected: false,
        message: 'Backend no disponible',
        error: error.message
      };
    }
  },
  
  // Obtener estadísticas de fuente
  getSourceInfo: () => {
    const source = localStorage.getItem('products_source') || 'unknown';
    const cacheTime = localStorage.getItem('products_cache_time');
    
    return {
      source,
      cacheTime,
      usingBackend: source === 'backend',
      usingCache: source === 'cache',
      usingInitial: source === 'initial'
    };
  }
};

// 📁 EXPORTAR FUNCIONES (mantener compatibilidad)
export const getProducts = productService.getProducts;
export const getProductById = productService.getProductById;
export const getFeaturedProducts = productService.getFeaturedProducts;
export const getProductsByCategory = productService.getProductsByCategory;
export const searchProducts = productService.searchProducts;
export const syncProducts = productService.syncProducts;
export const saveProducts = productService.saveProducts;