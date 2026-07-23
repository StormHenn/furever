import type { Animal, Prefs, MatchMode, Filters, SwipeDir } from '../types'
import { passesFilters } from './filters'

export function scoreFor(a: Animal, prefs: Prefs): number {
  const boost = prefs.species && (prefs.species === 'both' || prefs.species === a.species) ? 8 : 0
  return Math.min(99, a.score + boost)
}

export function isMatchEligible(a: Animal, mode: MatchMode): boolean {
  if (mode === 'every-like') return true
  if (mode === 'destiny') return a.mutual
  return false
}

export function remainingDeck(
  animals: Animal[],
  swiped: Record<string, SwipeDir>,
  f: Filters,
): Animal[] {
  return animals.filter((a) => !swiped[a.id] && passesFilters(a, f))
}
