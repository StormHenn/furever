import { describe, it, expect } from 'vitest'
import { nextStory } from './story'

describe('nextStory', () => {
  it('advances the pic within a story', () => {
    expect(nextStory({ idx: 0, pic: 0 }, 3)).toEqual({ idx: 0, pic: 1 })
  })
  it('advances to the next story after the last pic', () => {
    expect(nextStory({ idx: 0, pic: 2 }, 3)).toEqual({ idx: 1, pic: 0 })
  })
  it('closes after the last pic of the last story', () => {
    expect(nextStory({ idx: 2, pic: 2 }, 3)).toBeNull()
  })
})
