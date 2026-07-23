import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnimalPhoto } from './AnimalPhoto'

describe('AnimalPhoto', () => {
  it('renders an <img> when a src is provided', () => {
    render(<AnimalPhoto src="/x.jpg" name="Haku" shape="rounded" />)
    const img = screen.getByRole('img', { name: /haku/i })
    expect(img).toHaveAttribute('src', '/x.jpg')
  })

  it('disables native image drag so it does not hijack the swipe gesture', () => {
    render(<AnimalPhoto src="/x.jpg" name="Haku" shape="rounded" />)
    expect(screen.getByRole('img', { name: /haku/i })).toHaveAttribute('draggable', 'false')
  })

  it('opts out of the iOS long-press callout that lifts the image off the page', () => {
    render(<AnimalPhoto src="/x.jpg" name="Haku" shape="rounded" />)
    // draggable only governs desktop drag. On iOS the long-press peel is the
    // callout, and .no-callout carries the -webkit rule that turns it off
    // (jsdom drops the property itself, so the wiring is what we can assert).
    expect(screen.getByRole('img', { name: /haku/i })).toHaveClass('no-callout')
  })

  it('is never the hit-test target, so a touch always lands on the card behind it', () => {
    render(<AnimalPhoto src="/x.jpg" name="Haku" shape="rounded" />)
    expect(screen.getByRole('img', { name: /haku/i }).style.pointerEvents).toBe('none')
  })

  it('renders a fallback with the initial when no photo resolves', () => {
    render(<AnimalPhoto id="does-not-exist" name="Zed" shape="circle" />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('Z')).toBeInTheDocument()
  })
})
