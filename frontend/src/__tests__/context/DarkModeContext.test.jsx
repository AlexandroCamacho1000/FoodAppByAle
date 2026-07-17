import { describe, test, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { DarkModeProvider, useDarkMode } from '../../context/DarkModeContext'

describe('DarkModeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  test('inicia en false si localStorage no tiene valor y sistema no prefiere dark', () => {
    const { result } = renderHook(() => useDarkMode(), {
      wrapper: DarkModeProvider,
    })
    expect(result.current.dark).toBe(false)
  })

  test('toggle cambia de false a true', () => {
    const { result } = renderHook(() => useDarkMode(), {
      wrapper: DarkModeProvider,
    })

    act(() => {
      result.current.toggle()
    })

    expect(result.current.dark).toBe(true)
  })

  test('toggle persiste el valor en localStorage', () => {
    const { result } = renderHook(() => useDarkMode(), {
      wrapper: DarkModeProvider,
    })

    act(() => {
      result.current.toggle()
    })

    expect(localStorage.getItem('darkMode')).toBe('true')

    act(() => {
      result.current.toggle()
    })

    expect(localStorage.getItem('darkMode')).toBe('false')
  })
})
