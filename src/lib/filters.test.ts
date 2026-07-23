import { describe, it, expect } from 'vitest'
import { passesFilters, activeFilterCount } from './filters'
import type { Animal, Filters } from '../types'

const dog = { species: 'dog', dist: 3, age: 4 } as Animal
const wide: Filters = { species: 'all', maxDist: 25, maxAge: 12 }

describe('passesFilters', () => {
  it('passes when within all bounds', () => {
    expect(passesFilters(dog, wide)).toBe(true)
  })
  it('rejects wrong species', () => {
    expect(passesFilters(dog, { ...wide, species: 'cat' })).toBe(false)
  })
  it('rejects too far', () => {
    expect(passesFilters(dog, { ...wide, maxDist: 2 })).toBe(false)
  })
  it('rejects too old', () => {
    expect(passesFilters(dog, { ...wide, maxAge: 3 })).toBe(false)
  })
})

describe('activeFilterCount', () => {
  it('is 0 at defaults', () => {
    expect(activeFilterCount(wide)).toBe(0)
  })
  it('counts each narrowed dimension', () => {
    expect(activeFilterCount({ species: 'dog', maxDist: 10, maxAge: 5 })).toBe(3)
  })
})
