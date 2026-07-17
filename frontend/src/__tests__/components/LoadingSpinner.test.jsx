import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  test('renderiza el spinner sin texto', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  test('muestra texto cuando se pasa la prop text', () => {
    render(<LoadingSpinner text="Cargando..." />)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  test('no muestra texto cuando no se pasa prop text', () => {
    const { container } = render(<LoadingSpinner />)
    const textElement = container.querySelector('.text-gray-500')
    expect(textElement).not.toBeInTheDocument()
  })
})
