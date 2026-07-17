import { describe, test, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../context/AuthContext'

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('inicia con user null y sin autenticacion', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  test('login con credenciales cliente actualiza user y token', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await act(async () => {
      await result.current.login('cliente@test.com', 'cliente123')
    })

    expect(result.current.user).not.toBeNull()
    expect(result.current.user.email).toBe('cliente@test.com')
    expect(result.current.isAuthenticated).toBe(true)
  })

  test('logout limpia user y desautentica', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
