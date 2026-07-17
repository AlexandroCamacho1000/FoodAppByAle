import { describe, test, expect } from 'vitest'
import request from 'supertest'

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
