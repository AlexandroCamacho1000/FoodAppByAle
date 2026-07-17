import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Skeleton from '../../components/ui/Skeleton'

describe('Skeleton', () => {
  test('renderiza Skeleton.Text por defecto', () => {
    const { container } = render(<Skeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  test('renderiza Skeleton.Card con type card', () => {
    const { container } = render(<Skeleton type="card" />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  test('renderiza Skeleton.Text con lines personalizado', () => {
    const { container } = render(<Skeleton type="text" lines={5} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(5)
  })

  test('Skeleton.Card subcomponente se renderiza', () => {
    const { container } = render(<Skeleton.Card />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })
})
