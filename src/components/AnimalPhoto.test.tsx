import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnimalPhoto } from './AnimalPhoto'

describe('AnimalPhoto', () => {
  it('renders an <img> when a src is provided', () => {
    render(<AnimalPhoto src="/x.jpg" name="Haku" shape="rounded" />)
    const img = screen.getByRole('img', { name: /haku/i })
    expect(img).toHaveAttribute('src', '/x.jpg')
  })

  it('renders a fallback with the initial when no photo resolves', () => {
    render(<AnimalPhoto id="does-not-exist" name="Zed" shape="circle" />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('Z')).toBeInTheDocument()
  })
})
