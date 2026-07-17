import { describe, test, expect, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { CartProvider, useCart } from '../../context/CartContext'

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('inicia con carrito vacio', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    await waitFor(() => {
      expect(result.current.cart).toEqual([])
      expect(result.current.totalItems).toBe(0)
      expect(result.current.total).toBe(0)
    })
  })

  test('addToCart agrega un producto', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    const product = { id: 1, name: 'Test', price: 10, image: '/test.jpg' }

    await act(async () => {
      await result.current.addToCart(product, 2)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].id).toBe(1)
    expect(result.current.cart[0].quantity).toBe(2)
    expect(result.current.totalItems).toBe(2)
  })

  test('removeFromCart elimina un producto', async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    await act(async () => {
      await result.current.addToCart({ id: 1, name: 'Test', price: 10 }, 1)
    })

    await act(async () => {
      await result.current.removeFromCart(1)
    })

    expect(result.current.cart).toEqual([])
    expect(result.current.totalItems).toBe(0)
  })
})
