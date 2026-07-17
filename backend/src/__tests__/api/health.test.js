import { describe, test, expect, vi } from 'vitest'
import request from 'supertest'

vi.mock('../config/database', () => ({
  testConnection: vi.fn().mockResolvedValue(true),
  sequelize: {
    sync: vi.fn(),
    define: vi.fn(),
    transaction: vi.fn(() => ({ commit: vi.fn(), rollback: vi.fn() })),
  },
  Sequelize: {},
}))

vi.mock('../models', () => ({
  User: { findOne: vi.fn(), findByPk: vi.fn(), create: vi.fn(), findOrCreate: vi.fn() },
  Product: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn(), count: vi.fn() },
  Order: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn(), count: vi.fn() },
  OrderItem: { findAll: vi.fn(), create: vi.fn() },
  InviteCode: { findOne: vi.fn(), findAll: vi.fn(), create: vi.fn() },
  syncModels: vi.fn().mockResolvedValue(true),
  sequelize: {
    sync: vi.fn(),
    transaction: vi.fn(() => ({ commit: vi.fn(), rollback: vi.fn() })),
  },
  Sequelize: {},
}))

import app from '../../server'

describe('API Health', () => {
  test('GET /api/health retorna healthy', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('healthy')
    expect(res.body.service).toBe('Bolivian Market API')
  })

  test('GET / retorna bienvenida', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.body.message).toContain('Bienvenido')
  })

  test('GET /ruta-inexistente retorna 404', async () => {
    const res = await request(app).get('/api/nonexistent')
    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
    expect(res.body.error).toBe('Ruta no encontrada')
  })
})
