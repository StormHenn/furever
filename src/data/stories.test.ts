import { describe, it, expect } from 'vitest'
import { shelterStories } from './stories'

describe('shelterStories', () => {
  it('has three agencies each with a monogram, tint and a non-empty deck', () => {
    expect(shelterStories).toHaveLength(3)
    for (const s of shelterStories) {
      expect(s.mono).toMatch(/^[A-Z]{2}$/)
      expect(['rust', 'sage', 'amber']).toContain(s.tint)
      expect(s.events.length).toBeGreaterThan(0)
      for (const e of s.events) {
        expect(['upcoming', 'recap']).toContain(e.kind)
      }
    }
  })

  it('mixes upcoming and recap kinds and varies deck length', () => {
    const lengths = shelterStories.map((s) => s.events.length)
    expect(new Set(lengths).size).toBeGreaterThan(1) // not all the same
    const kinds = shelterStories.flatMap((s) => s.events.map((e) => e.kind))
    expect(kinds).toContain('upcoming')
    expect(kinds).toContain('recap')
  })
})
