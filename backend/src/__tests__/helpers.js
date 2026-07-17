import jwt from 'jsonwebtoken'
import { vi } from 'vitest'

// ============================================
// createTestUser — fábrica de usuarios de prueba
// ============================================
// Cada test puede sobrescribir cualquier campo:
//   createTestUser({ role: 'admin', email: 'admin@test.com' })
export const createTestUser = (overrides = {}) => {
  const baseUser = {
    id: 'user-1',
    name: 'Juan Pérez',
    email: 'juan@test.com',
    role: 'user',
    phone: '+591 70000000',
    location: 'La Paz',
    password: '$2a$10$hashed_password',
    avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=0BC5EA&color=fff',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),

    // Métodos que usan los controladores
    comparePassword: vi.fn().mockReturnValue(true),
    toJSON: function () {
      const { password, ...rest } = { ...this }
      return rest
    },
    save: vi.fn().mockResolvedValue(true),
    destroy: vi.fn().mockResolvedValue(true),
  }

  return { ...baseUser, ...overrides }
}

// ============================================
// generateToken — genera un JWT real para tests
// ============================================
// Los controladores verifican el token para autenticar.
export const generateToken = (userId = 'user-1') => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

// ============================================
// createTestProduct — fábrica de productos de prueba
// ============================================
export const createTestProduct = (overrides = {}) => {
  const baseProduct = {
    id: 'prod-1',
    name: 'Salteña Paceña',
    description: 'Deliciosa salteña tradicional paceña.',
    descriptionEn: 'Traditional La Paz salteña.',
    price: 12.50,
    image: '/images/saltena.jpg',
    category: 'salteñas',
    stock: 50,
    featured: true,
    active: true,
    rating: 4.8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    save: vi.fn().mockResolvedValue(true),
    toJSON: function () {
      return { ...this }
    },
  }

  return { ...baseProduct, ...overrides }
}

// ============================================
// createTestOrder — fábrica de órdenes de prueba
// ============================================
export const createTestOrder = (overrides = {}) => {
  const baseOrder = {
    id: 'order-1',
    userId: 'user-1',
    status: 'pendiente',
    total: 50.00,
    shippingAddress: 'Calle 123, La Paz',
    phone: '+591 70000000',
    notes: '',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    save: vi.fn().mockResolvedValue(true),
    toJSON: function () {
      return { ...this }
    },
  }

  return { ...baseOrder, ...overrides }
}
