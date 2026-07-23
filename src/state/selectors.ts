import type { Animal } from '../types'
import type { AppState } from './reducer'
import { animals } from '../data/animals'
import { prefLabels } from '../data/quiz'
import { MATCH_MODE } from '../config'
import { remainingDeck, isMatchEligible, scoreFor } from '../lib/matching'

export function selectDeck(s: AppState): Animal[] {
  return remainingDeck(animals, s.swiped, s.filters)
}

export function selectTopId(s: AppState): string | null {
  return selectDeck(s)[0]?.id ?? null
}

export function selectLiked(s: AppState): Animal[] {
  return animals.filter((a) => s.swiped[a.id] === 'like')
}

export function selectMutuals(s: AppState): Animal[] {
  return selectLiked(s).filter((a) => isMatchEligible(a, MATCH_MODE))
}

export function selectShortlist(s: AppState): Animal[] {
  return selectLiked(s).filter((a) => !isMatchEligible(a, MATCH_MODE))
}

export function selectScore(s: AppState, a: Animal): number {
  return scoreFor(a, s.prefs)
}

export function selectPrefChips(s: AppState): string[] {
  return Object.values(s.prefs).map((v) => prefLabels[v] ?? v)
}
