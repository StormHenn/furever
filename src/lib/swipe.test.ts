import { describe, it, expect } from 'vitest'
import { swipeOutcome } from './swipe'

describe('swipeOutcome', () => {
  it('likes past the right threshold', () => {
    expect(swipeOutcome(120)).toBe('like')
  })
  it('nopes past the left threshold', () => {
    expect(swipeOutcome(-120)).toBe('nope')
  })
  it('returns null within the threshold', () => {
    expect(swipeOutcome(50)).toBeNull()
    expect(swipeOutcome(-50)).toBeNull()
  })
})
