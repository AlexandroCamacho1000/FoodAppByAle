import api from './api';

const initialProducts = [
  {
    id: 1,
    name: "Salteña Paceña",
    description: "Deliciosa salteña tradicional paceña con jugoso relleno de carne, papa, arvejas y especias.",
    descriptionEn: "Traditional La Paz salteña with juicy beef filling, potatoes, peas and spices.",
    price: 12.50,
    category: "Salteñas",
    image: "/images/saltena.jpg",
    stock: 50,
    featured: true,
    rating: 4.8,
    prepTime: "25 min",
    ingredients: "Carne de res, papa, arvejas, cebolla, ají colorado, comino",
    ingredientsEn: "Beef, potatoes, peas, onion, red chili, cumin",
    isActive: true
  },
  {
    id: 2,
    name: "Anticuchos",
    description: "Brochetas de corazón de res marinadas en ají y especias, acompañadas de papas y salsa de maní.",
    descriptionEn: "Beef heart skewers marinated in chili and spices, served with potatoes and peanut sauce.",
    price: 25.00,
    category: "Carnes",
    image: "/images/anticuchos.jpg",
    stock: 30,
    featured: true,
    rating: 4.9,
    prepTime: "20 min",
    ingredients: "Corazón de res, ají panca, vinagre, comino, ajo, orégano",
    ingredientsEn: "Beef heart, chili, vinegar, cumin, garlic, oregano",
    isActive: true
  },
  {
    id: 3,
    name: "Sopa de Maní",
    description: "Crema espesa de maní con papa, arroz y carne, acompañada de chuño phuti.",
    descriptionEn: "Thick peanut cream soup with potato, rice and beef, served with chuño phuti.",
    price: 18.00,
    category: "Platos Fuertes",
    image: "/images/sopa-mani.jpg",
    stock: 25,
    featured: false,
    rating: 4.6,
    prepTime: "40 min",
    ingredients: "Maní, papa, arroz, carne de res, chuño, cebolla",
    ingredientsEn: "Peanuts, potato, rice, beef, freeze-dried potato, onion",
    isActive: true
  },
  {
    id: 4,
    name: "Pique Macho",
    description: "Trozos de carne, salchicha, papas fritas, cebolla, locoto y huevo, bañados en salsa de la casa.",
    descriptionEn: "Beef pieces, sausage, french fries, onion, locoto and egg, bathed in house sauce.",
    price: 45.00,
    category: "Platos Fuertes",
    image: "/images/pique-macho.jpg",
    stock: 20,
    featured: true,
    rating: 4.8,
    prepTime: "50 min",
    ingredients: "Carne de res, salchicha, papa, huevo, tomate, locoto, cebolla",
    ingredientsEn: "Beef, sausage, potato, egg, tomato, locoto pepper, onion",
    isActive: true
  },
  {
    id: 5,
    name: "Silpancho Cochabambino",
    description: "Arroz, papa dorada, carne empanizada, huevo frito, salsa criolla y ensalada.",
    descriptionEn: "Rice, golden potatoes, breaded beef, fried egg, criollo sauce and salad.",
    price: 35.00,
    category: "Platos Fuertes",
    image: "/images/silpancho.jpg",
    stock: 25,
    featured: true,
    rating: 4.7,
    prepTime: "60 min",
    ingredients: "Arroz, papa, carne de res, huevo, tomate, cebolla, lechuga",
    ingredientsEn: "Rice, potato, beef, egg, tomato, onion, lettuce",
    isActive: true
  },
  {
    id: 6,
    name: "Majadito",
    description: "Arroz con carne desmenuzada, plátano frito, huevo y yuca, típico del oriente boliviano.",
    descriptionEn: "Rice with shredded beef, fried plantain, egg and yucca, typical of eastern Bolivia.",
    price: 30.00,
    category: "Platos Fuertes",
    image: "/images/majadito.jpg",
    stock: 20,
    featured: false,
    rating: 4.5,
    prepTime: "45 min",
    ingredients: "Arroz, carne desmenuzada, plátano, huevo, yuca, cebolla",
    ingredientsEn: "Rice, shredded beef, plantain, egg, yucca, onion",
    isActive: true
  },
  {
    id: 7,
    name: "Api con Pastel",
    description: "Bebida caliente de maíz morado acompañada de pastel de queso o empanada de queso.",
    descriptionEn: "Hot purple corn drink served with cheese pastry or cheese empanada.",
    price: 15.00,
    category: "Bebidas",
    image: "/images/api-pastel.jpg",
    stock: 40,
    featured: true,
    rating: 4.7,
    prepTime: "15 min",
    ingredients: "Maíz morado, piña, canela, clavo de olor, azúcar",
    ingredientsEn: "Purple corn, pineapple, cinnamon, cloves, sugar",
    isActive: true
  },
  {
    id: 8,
    name: "Mocochinchi",
    description: "Refrescante bebida de durazno deshidratado, canela y clavo de olor.",
    descriptionEn: "Refreshing dried peach drink with cinnamon and cloves.",
    price: 12.00,
    category: "Bebidas",
    image: "/images/mocochinchi.jpg",
    stock: 50,
    featured: false,
    rating: 4.6,
    prepTime: "10 min",
    ingredients: "Durazno deshidratado, canela, clavo de olor, azúcar",
    ingredientsEn: "Dried peach, cinnamon, cloves, sugar",
    isActive: true
  },
  {
    id: 9,
    name: "Humintas",
    description: "Choclo rallado envuelto en sus propias hojas, relleno de queso y anís.",
    descriptionEn: "Grated corn wrapped in corn husks, filled with cheese and anise.",
    price: 10.00,
    category: "Entradas",
    image: "/images/humintas.jpg",
    stock: 35,
    featured: true,
    rating: 4.7,
    prepTime: "30 min",
    ingredients: "Choclo, queso, anís, sal, mantequilla",
    ingredientsEn: "Corn, cheese, anise, salt, butter",
    isActive: true
  },
  {
    id: 10,
    name: "Cuñapé",
    description: "Panecillos de queso y yuca, típicos del oriente boliviano, crujientes por fuera y suaves por dentro.",
    descriptionEn: "Cheese and yucca bread rolls, typical of eastern Bolivia, crispy outside and soft inside.",
    price: 8.00,
    category: "Entradas",
    image: "/images/cunape.jpg",
    stock: 40,
    featured: false,
    rating: 4.8,
    prepTime: "25 min",
    ingredients: "Yuca, queso, huevo, leche, mantequilla, sal",
    ingredientsEn: "Yucca, cheese, egg, milk, butter, salt",
    isActive: true
  },
  {
    id: 11,
    name: "Leche Asada",
    description: "Postre tradicional boliviano a base de leche, huevos, azúcar y canela, horneado a la perfección.",
    descriptionEn: "Traditional Bolivian dessert made with milk, eggs, sugar and cinnamon, baked to perfection.",
    price: 15.00,
    category: "Postres",
    image: "/images/leche-asada.jpg",
    stock: 30,
    featured: false,
    rating: 4.9,
    prepTime: "50 min",
    ingredients: "Leche, huevos, azúcar, canela, esencia de vainilla",
    ingredientsEn: "Milk, eggs, sugar, cinnamon, vanilla extract",
    isActive: true
  }
];

const normalizeCategory = (category) => {
  const map = {
    'Salteñas': 'salteñas',
    'Platos Fuertes': 'platos_fuertes',
    'Carnes': 'carnes',
    'Bebidas': 'bebidas',
    'Entradas': 'entradas',
    'Postres': 'postres'
  };
  return map[category] || category;
};

const normalizeProducts = (products) => {
  return (Array.isArray(products) ? products : []).map(p => ({
    ...p,
    category: normalizeCategory(p.category)
  }));
};

const loadProductsFromBackend = async () => {
  try {
    const response = await api.get('/products');
    const backendProducts = response.data.products || response.data;
    localStorage.setItem('backend_products_cache', JSON.stringify(backendProducts));
    localStorage.setItem('products_source', 'backend');
    return normalizeProducts(backendProducts);
  } catch {
    try {
      const cachedProducts = JSON.parse(localStorage.getItem('backend_products_cache') || '[]');
      if (cachedProducts.length > 0) {
        localStorage.setItem('products_source', 'cache');
        return normalizeProducts(cachedProducts);
      }
    } catch {
      // ignore
    }
    localStorage.setItem('products_source', 'initial');
    return normalizeProducts(initialProducts);
  }
};

const getProductsByCategoryImpl = async (category) => {
  const products = await loadProductsFromBackend();
  const filtered = category === 'all'
    ? products
    : products.filter(p => String(p.category).toLowerCase() === String(category).toLowerCase());
  return filtered;
};

export const productService = {
  getProducts: async () => {
    return await loadProductsFromBackend();
  },
  
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.product || response.data;
    } catch {
      // not found on backend, try local
    }
    const products = await loadProductsFromBackend();
    const product = products.find(p => p.id.toString() === id.toString());
    if (product) {
      return product;
    }
    throw new Error(`Producto con ID ${id} no encontrado`);
  },
  
  getFeaturedProducts: async () => {
    const products = await loadProductsFromBackend();
    return products.filter(p => p.featured).slice(0, 4);
  },
  
  getProductsByCategory: getProductsByCategoryImpl,
  
  searchProducts: async (query) => {
    const products = await loadProductsFromBackend();
    const searchTerm = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.descriptionEn?.toLowerCase().includes(searchTerm) ||
      product.ingredients?.toLowerCase().includes(searchTerm) ||
      product.ingredientsEn?.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  },
  
  syncProducts: () => {
    const adminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    if (adminProducts.length > 0) {
      const activeProducts = adminProducts.filter(p => p.isActive !== false);
      localStorage.setItem('menu_products', JSON.stringify(activeProducts));
      return true;
    }
    return false;
  },
  
  saveProducts: (products) => {
    localStorage.setItem('admin_products', JSON.stringify(products));
    return true;
  },
  
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

export const getProducts = productService.getProducts;
export const getProductById = productService.getProductById;
export const getFeaturedProducts = productService.getFeaturedProducts;
export const getProductsByCategory = productService.getProductsByCategory;
export const searchProducts = productService.searchProducts;
export const syncProducts = productService.syncProducts;
export const saveProducts = productService.saveProducts;
