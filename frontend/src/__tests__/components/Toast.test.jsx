import { describe, test, expect, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Toast from '../../components/ui/Toast'

afterEach(() => {
  vi.useRealTimers()
})

describe('Toast component', () => {
  test('muestra el mensaje cuando show=true', () => {
    render(<Toast message="Producto agregado" show={true} onClose={() => {}} />)
    expect(screen.getByText('Producto agregado')).toBeInTheDocument()
  })

  test('no renderiza nada cuando show=false', () => {
    const { container } = render(
      <Toast message="Producto agregado" show={false} onClose={() => {}} />
    )
    expect(container.innerHTML).toBe('')
  })

  test('se cierra automáticamente después de 2.5 segundos', () => {
    vi.useFakeTimers()
    const onClose = vi.fn()

    render(<Toast message="Test" show={true} onClose={onClose} />)

    expect(onClose).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2500)
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
