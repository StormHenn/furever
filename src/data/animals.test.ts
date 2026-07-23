import { describe, it, expect } from 'vitest'
import { animals, detailCaptions } from './animals'

describe('animals seed data', () => {
  it('has 8 animals with unique ids', () => {
    expect(animals).toHaveLength(8)
    expect(new Set(animals.map((a) => a.id)).size).toBe(8)
  })

  it('has exactly two mutual animals (destiny mode)', () => {
    // reference: biscuit, pretzel, pickle flagged mutual
    expect(animals.filter((a) => a.mutual).map((a) => a.id).sort()).toEqual(
      ['biscuit', 'pickle', 'pretzel'],
    )
  })

  it('provides three detail captions per animal', () => {
    for (const a of animals) {
      expect(detailCaptions[a.id]).toHaveLength(3)
    }
  })
})
