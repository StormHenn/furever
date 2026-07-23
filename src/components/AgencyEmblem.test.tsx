import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AgencyEmblem } from './AgencyEmblem'

describe('AgencyEmblem', () => {
  it('renders the monogram', () => {
    render(<AgencyEmblem mono="HT" tint="rust" />)
    expect(screen.getByText('HT')).toBeInTheDocument()
  })

  it('applies the tint colour class', () => {
    render(<AgencyEmblem mono="WH" tint="sage" />)
    expect(screen.getByText('WH').className).toContain('bg-sage')
  })
})
