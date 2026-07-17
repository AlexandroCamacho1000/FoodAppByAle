import { describe, test, expect } from 'vitest'
import {
  calculateCartTotal,
  getCartItemCount,
  calculateShipping,
  calculateTax,
  isProductInCart,
  getProductQuantity,
} from '../../services/cartService'

describe('calculateCartTotal', () => {
  test('suma precios por cantidad de cada item', () => {
    const cart = [
      { price: 12.50, quantity: 2 },
      { price: 25.00, quantity: 1 },
    ]
    expect(calculateCartTotal(cart)).toBe(50)
  })

  test('carrito vacío retorna 0', () => {
    expect(calculateCartTotal([])).toBe(0)
  })
})

describe('getCartItemCount', () => {
  test('suma todas las cantidades', () => {
    const cart = [
      { quantity: 2 },
      { quantity: 3 },
      { quantity: 1 },
    ]
    expect(getCartItemCount(cart)).toBe(6)
  })

  test('carrito vacío retorna 0', () => {
    expect(getCartItemCount([])).toBe(0)
  })
})

describe('calculateShipping', () => {
  test('subtotal mayor a 100 es gratis', () => {
    expect(calculateShipping([{}], 150)).toBe(0)
  })

  test('subtotal menor o igual a 100 cuesta 15', () => {
    expect(calculateShipping([{}], 50)).toBe(15)
    expect(calculateShipping([{}], 100)).toBe(15)
  })

  test('carrito vacío es 0', () => {
    expect(calculateShipping([], 0)).toBe(0)
  })
})

describe('calculateTax', () => {
  test('13% del subtotal', () => {
    expect(calculateTax(100)).toBe(13)
    expect(calculateTax(50)).toBe(6.5)
    expect(calculateTax(0)).toBe(0)
  })
})

describe('isProductInCart', () => {
  test('retorna true si el producto existe en el carrito', () => {
    const cart = [{ id: 1 }, { id: 2 }]
    expect(isProductInCart(cart, 1)).toBe(true)
  })

  test('retorna false si el producto no está en el carrito', () => {
    const cart = [{ id: 1 }]
    expect(isProductInCart(cart, 999)).toBe(false)
  })
})

describe('getProductQuantity', () => {
  test('retorna la cantidad del producto si existe', () => {
    const cart = [{ id: 1, quantity: 5 }]
    expect(getProductQuantity(cart, 1)).toBe(5)
  })

  test('retorna 0 si el producto no está en el carrito', () => {
    const cart = [{ id: 1, quantity: 3 }]
    expect(getProductQuantity(cart, 999)).toBe(0)
  })
})
