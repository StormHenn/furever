import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SwipeCard } from './SwipeCard'
import type { Animal } from '../types'

const animal = {
  id: 'haku', name: 'Haku', species: 'dog', breed: 'Australian Shepherd',
  age: 2, dist: 1.2, shelter: 'x', fee: 'y', score: 88, mutual: true,
  tags: ['food-motivated'], kids: 'YES', dogs: 'YES', cats: 'ASK', bio: 'z',
} as Animal

describe('SwipeCard', () => {
  it('renders name, score and tags for the top card', () => {
    render(<SwipeCard animal={animal} score={88} position={0} onCommit={vi.fn()} onOpenDetail={vi.fn()} />)
    expect(screen.getByText('Haku')).toBeInTheDocument()
    expect(screen.getByText('88')).toBeInTheDocument()
    expect(screen.getByText('food-motivated')).toBeInTheDocument()
  })

  it('opens detail on a tap (no drag) when it is the top card', () => {
    const onOpenDetail = vi.fn()
    render(<SwipeCard animal={animal} score={88} position={0} onCommit={vi.fn()} onOpenDetail={onOpenDetail} />)
    fireEvent.click(screen.getByText('Haku'))
    expect(onOpenDetail).toHaveBeenCalledOnce()
  })

  it('renders nothing when position is negative', () => {
    const { container } = render(<SwipeCard animal={animal} score={88} position={-1} onCommit={vi.fn()} onOpenDetail={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })
})
