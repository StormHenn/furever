import type { Animal, Filters } from '../types'

export function passesFilters(a: Animal, f: Filters): boolean {
  return (f.species === 'all' || a.species === f.species) && a.dist <= f.maxDist && a.age <= f.maxAge
}

export function activeFilterCount(f: Filters): number {
  return (f.species !== 'all' ? 1 : 0) + (f.maxDist < 25 ? 1 : 0) + (f.maxAge < 12 ? 1 : 0)
}
