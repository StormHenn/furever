import { describe, it, expect } from 'vitest'
import { nextStory } from './story'

describe('nextStory', () => {
  it('advances the slide within a deck', () => {
    expect(nextStory({ idx: 0, pic: 0 }, 4, 3)).toEqual({ idx: 0, pic: 1 })
  })
  it('rolls to the next agency after the last slide of a deck', () => {
    expect(nextStory({ idx: 0, pic: 3 }, 4, 3)).toEqual({ idx: 1, pic: 0 })
  })
  it('handles a shorter deck', () => {
    expect(nextStory({ idx: 1, pic: 2 }, 3, 3)).toEqual({ idx: 2, pic: 0 })
  })
  it('closes after the last slide of the last agency', () => {
    expect(nextStory({ idx: 2, pic: 2 }, 3, 3)).toBeNull()
  })
})
