import { describe, it, expect } from 'vitest'
import { initialState } from './reducer'
import { selectDeck, selectLiked, selectMutuals, selectPrefChips } from './selectors'

describe('selectors', () => {
  it('selectDeck returns all animals at the start', () => {
    expect(selectDeck(initialState).length).toBe(8)
  })
  it('selectLiked reflects liked swipes', () => {
    const s = { ...initialState, swiped: { biscuit: 'like' as const, clementine: 'nope' as const } }
    expect(selectLiked(s).map((a) => a.id)).toEqual(['biscuit'])
  })
  it('selectMutuals returns eligible likes (destiny)', () => {
    const s = { ...initialState, swiped: { biscuit: 'like' as const, clementine: 'like' as const } }
    expect(selectMutuals(s).map((a) => a.id)).toEqual(['biscuit'])
  })
  it('selectPrefChips maps stored prefs to labels', () => {
    const s = { ...initialState, prefs: { species: 'dog', energy: 'chill' } }
    expect(selectPrefChips(s)).toEqual(['Team Woof', 'Couch potato'])
  })
})
