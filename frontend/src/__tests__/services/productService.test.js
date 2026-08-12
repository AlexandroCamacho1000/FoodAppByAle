import { describe, test, expect, beforeEach, vi } from 'vitest'
import { productService } from '../../services/productService'

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('getProducts retorna initialProducts cuando el backend falla', async () => {
    const products = await productService.getProducts()
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBe(11)
    expect(products[0]).toHaveProperty('name')
    expect(products[0]).toHaveProperty('price')
  })

  test('getProductById retorna producto correcto por id', async () => {
    const product = await productService.getProductById(5)
    expect(product.id).toBe(5)
    expect(product.name).toBe('Silpancho Cochabambino')
    expect(product.price).toBe(35)
  })

  test('getProductsByCategory retorna productos filtrados por categoria', async () => {
    const products = await productService.getProductsByCategory('Bebidas')
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
    products.forEach(p => expect(p.category.toLowerCase()).toBe('bebidas'))
  })

  test('getFeaturedProducts retorna solo productos destacados (max 4)', async () => {
    const products = await productService.getFeaturedProducts()
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeLessThanOrEqual(4)
    products.forEach(p => expect(p.featured).toBe(true))
  })

  test('searchProducts encuentra por nombre', async () => {
    const products = await productService.searchProducts('salteña')
    expect(products.length).toBeGreaterThan(0)
    products.forEach(p =>
      expect(p.name.toLowerCase()).toContain('salteña')
    )
  })

  test('searchProducts retorna vacio si no hay coincidencias', async () => {
    const products = await productService.searchProducts('xyz123noexiste')
    expect(products).toEqual([])
  })
})
