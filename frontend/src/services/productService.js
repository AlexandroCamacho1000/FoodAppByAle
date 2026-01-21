// Datos de productos bolivianos REALES (mock para desarrollo)
const mockProducts = [
  {
    id: 1,
    name: "Salteñas Paceñas",
    description: "Empanadas horneadas rellenas de carne jugosa, papa, arvejas y aceitunas. Tradición paceña.",
    price: 15,
    category: "Salteñas",
    image: "/images/saltenas.jpg",
    stock: 50,
    featured: true,
    rating: 4.8,
    prepTime: "25 min"
  },
  {
    id: 2,
    name: "Anticuchos",
    description: "Brochetas de corazón de res marinadas en ají, comino y especias. A la parrilla.",
    price: 28,
    category: "Carnes",
    image: "/images/anticuchos.jpg",
    stock: 30,
    featured: true,
    rating: 4.9,
    prepTime: "20 min"
  },
  {
    id: 3,
    name: "Sillpancho Cochabambino",
    description: "Arroz, papa dorada, carne empanizada, huevo frito, salsa criolla y llajwa.",
    price: 42,
    category: "Platos de Fondo",
    image: "/images/sillpancho.jpg",
    stock: 25,
    featured: true,
    rating: 4.7,
    prepTime: "35 min"
  },
  {
    id: 4,
    name: "Pique Macho",
    description: "Carne, salchichas, papas fritas, huevo, tomate, cebolla, locoto y mayonesa.",
    price: 55,
    category: "Platos de Fondo",
    image: "/images/pique-macho.jpg",
    stock: 20,
    featured: false,
    rating: 4.9,
    prepTime: "40 min"
  },
  {
    id: 5,
    name: "Api con Pastel",
    description: "Bebida caliente de maíz morado con canela. Acompañado de pastel frito.",
    price: 12,
    category: "Bebidas",
    image: "/images/api-pastel.jpg",
    stock: 100,
    featured: false,
    rating: 4.6,
    prepTime: "15 min"
  },
  {
    id: 6,
    name: "Humintas",
    description: "Tamales dulces de maíz envueltos en chala. Tradición valluna.",
    price: 10,
    category: "Entradas",
    image: "/images/humintas.jpg",
    stock: 40,
    featured: false,
    rating: 4.5,
    prepTime: "30 min"
  }
];

// Simulación de API call
export const getProducts = async () => {
  // En desarrollo: retorna mock data
  // En producción: fetch(`${API_URL}/products`)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 300); // Simula delay de red
  });
};

export const getProductById = async (id) => {
  const product = mockProducts.find(p => p.id === parseInt(id));
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      product ? resolve(product) : reject(new Error("Producto no encontrado"));
    }, 200);
  });
};

export const getFeaturedProducts = async () => {
  return mockProducts.filter(p => p.featured);
};

export const getProductsByCategory = async (category) => {
  return mockProducts.filter(p => p.category === category);
};