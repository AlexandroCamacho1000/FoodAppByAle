import { describe, test, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '../../context/LanguageContext'

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('inicia con idioma es (por defecto en Bolivia)', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    })
    expect(result.current.language).toBe('es')
  })

  test('toggleLanguage cambia de es a en', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    })

    act(() => {
      result.current.toggleLanguage()
    })

    expect(result.current.language).toBe('en')
  })

  test('t retorna la traduccion correcta para una clave existente', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    })
    expect(result.current.t('nav.home')).toBe('Inicio')
  })

  test('t retorna la clave si no encuentra traduccion', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    })
    expect(result.current.t('clave.inexistente')).toBe('clave.inexistente')
  })
})
