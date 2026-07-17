import { describe, test, expect } from 'vitest'
import request from 'supertest'
import express from 'express'

function createTestApp() {
  const app = express()

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'Bolivian Market API',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  })

  app.get('/', (req, res) => {
    res.json({ message: '¡Bienvenido a la API de Bolivian Market!', version: '1.0.0' })
  })

  app.use('*', (req, res) => {
    res.status(404).json({ success: false, error: 'Ruta no encontrada', path: req.originalUrl })
  })

  return app
}

describe('API Health', () => {
  const app = createTestApp()

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
