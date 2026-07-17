import { vi } from 'vitest'

// ============================================
// MOCK de Sequelize y los modelos
// ============================================
// Reemplazamos todos los modelos con versiones falsas.
// Cada método (findOne, findAll, create, etc.) es un vi.fn()
// que cada test va a configurar con mockReturnValue o mockResolvedValue.

vi.mock('../models', () => ({
  User: {
    findOne: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
    findOrCreate: vi.fn(),
    update: vi.fn(),
  },
  Product: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    bulkCreate: vi.fn(),
  },
  Order: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
    sum: vi.fn(),
    findAndCountAll: vi.fn(),
  },
  OrderItem: {
    findAll: vi.fn(),
    create: vi.fn(),
  },
  InviteCode: {
    findOne: vi.fn(),
    findAll: vi.fn(),
    create: vi.fn(),
  },
  sequelize: {
    transaction: vi.fn(() => ({
      commit: vi.fn(),
      rollback: vi.fn(),
    })),
    fn: vi.fn(),
    col: vi.fn(),
    sync: vi.fn(),
  },
  Sequelize: {},
}))

// ============================================
// Variables de entorno para los tests
// ============================================
process.env.JWT_SECRET = 'test-jwt-secret-key-for-tests'
process.env.JWT_EXPIRE = '7d'
process.env.STRIPE_SECRET_KEY = 'sk_test_mocked_for_tests'
process.env.SUPERADMIN_EMAIL = 'superadmin@bolivianmarket.com'
process.env.SUPERADMIN_PASSWORD = 'superadmin123'
process.env.PORT = '5000'
process.env.NODE_ENV = 'test'
