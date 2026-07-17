// Datos de prueba reutilizables para todos los tests del frontend
// Así no repetimos objetos en cada archivo de test

export const mockProduct = {
  id: 1,
  name: 'Salteña Paceña',
  description: 'Deliciosa salteña tradicional paceña con jugoso relleno de carne.',
  descriptionEn: 'Traditional La Paz salteña with juicy beef filling.',
  price: 12.50,
  category: 'salteñas',
  image: '/images/saltena.jpg',
  featured: true,
  stock: 50,
  rating: 4.8,
  prepTime: '25 min',
  ingredients: 'Carne de res, papa, arvejas, cebolla, ají colorado, comino',
  ingredientsEn: 'Beef, potatoes, peas, onion, red chili, cumin',
  isActive: true,
}

export const mockProductNoImage = {
  id: 2,
  name: 'Anticuchos',
  description: 'Brochetas de corazón de res.',
  price: 25.00,
  category: 'carnes',
  featured: false,
  stock: 30,
}

export const mockCart = [
  {
    id: 1,
    productId: 1,
    name: 'Salteña Paceña',
    price: 12.50,
    quantity: 2,
    image: '/images/saltena.jpg',
    description: 'Deliciosa salteña...',
    category: 'salteñas',
  },
  {
    id: 2,
    productId: 2,
    name: 'Anticuchos',
    price: 25.00,
    quantity: 1,
    image: '/images/anticuchos.jpg',
    description: 'Brochetas de corazón...',
    category: 'carnes',
  },
]

export const mockUser = {
  id: 'user-1',
  name: 'Juan Pérez',
  email: 'juan@test.com',
  role: 'user',
  avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=0BC5EA&color=fff',
  phone: '+591 71234567',
  location: 'La Paz, Bolivia',
}

export const mockAdminUser = {
  ...mockUser,
  name: 'Super Admin',
  role: 'superadmin',
  email: 'superadmin@bolivianmarket.com',
  avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=805AD5&color=fff',
}
