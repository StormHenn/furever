import { describe, it, expect } from 'vitest'
import { scoreFor, isMatchEligible, remainingDeck } from './matching'
import type { Animal, Filters, SwipeDir } from '../types'

const dog = { id: 'd', species: 'dog', score: 88, mutual: true, dist: 2, age: 3 } as Animal
const cat = { id: 'c', species: 'cat', score: 70, mutual: false, dist: 2, age: 3 } as Animal
const wide: Filters = { species: 'all', maxDist: 25, maxAge: 12 }

describe('scoreFor', () => {
  it('adds no boost without species pref', () => {
    expect(scoreFor(dog, {})).toBe(88)
  })
  it('adds 8 when species pref matches', () => {
    expect(scoreFor(cat, { species: 'cat' })).toBe(78)
  })
  it('adds 8 for "both"', () => {
    expect(scoreFor(cat, { species: 'both' })).toBe(78)
  })
  it('caps at 99', () => {
    expect(scoreFor({ ...dog, score: 95 } as Animal, { species: 'dog' })).toBe(99)
  })
})

describe('isMatchEligible', () => {
  it('every-like → always true', () => {
    expect(isMatchEligible(cat, 'every-like')).toBe(true)
  })
  it('destiny → only mutual', () => {
    expect(isMatchEligible(dog, 'destiny')).toBe(true)
    expect(isMatchEligible(cat, 'destiny')).toBe(false)
  })
  it('never → always false', () => {
    expect(isMatchEligible(dog, 'never')).toBe(false)
  })
})

describe('remainingDeck', () => {
  it('excludes swiped and filtered-out animals', () => {
    const swiped: Record<string, SwipeDir> = { d: 'like' }
    expect(remainingDeck([dog, cat], swiped, wide).map((a) => a.id)).toEqual(['c'])
  })
})
