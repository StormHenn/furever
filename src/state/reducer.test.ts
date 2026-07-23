import { describe, it, expect } from 'vitest'
import { reducer, initialState } from './reducer'

describe('reducer', () => {
  it('starts on the configured start screen', () => {
    expect(initialState.screen).toBe('login')
  })

  it('SUBMIT_LOGIN goes to onboarding at step 0', () => {
    const s = reducer(initialState, { type: 'SUBMIT_LOGIN' })
    expect(s.screen).toBe('onboarding')
    expect(s.obStep).toBe(0)
  })

  it('PICK_QUIZ_OPTION advances step then finishes to discover', () => {
    let s = reducer(initialState, { type: 'PICK_QUIZ_OPTION', key: 'species', value: 'dog' })
    expect(s.obStep).toBe(1)
    expect(s.prefs.species).toBe('dog')
    s = { ...s, obStep: 2 }
    s = reducer(s, { type: 'PICK_QUIZ_OPTION', key: 'energy', value: 'chill' })
    expect(s.screen).toBe('discover')
    expect(s.obStep).toBe(0)
  })

  it('SWIPE records direction', () => {
    const s = reducer(initialState, { type: 'SWIPE', id: 'moon-cake', dir: 'nope' })
    expect(s.swiped['moon-cake']).toBe('nope')
  })

  it('liking a mutual animal sets matchId (destiny mode)', () => {
    const s = reducer(initialState, { type: 'SWIPE', id: 'haku', dir: 'like' })
    expect(s.matchId).toBe('haku')
  })

  it('liking a non-mutual animal does not set matchId (destiny mode)', () => {
    const s = reducer(initialState, { type: 'SWIPE', id: 'moon-cake', dir: 'like' })
    expect(s.matchId).toBeNull()
  })

  it('OPEN_CHAT seeds an initial thread once and switches screen', () => {
    const s = reducer(initialState, { type: 'OPEN_CHAT', id: 'haku' })
    expect(s.screen).toBe('chat')
    expect(s.chatId).toBe('haku')
    expect(s.threads.haku).toHaveLength(1)
    const again = reducer(s, { type: 'OPEN_CHAT', id: 'haku' })
    expect(again.threads.haku).toHaveLength(1) // not re-seeded
  })

  it('SEND_MESSAGE appends a "me" message and clears the draft', () => {
    let s = reducer(initialState, { type: 'OPEN_CHAT', id: 'haku' })
    s = reducer({ ...s, chatDraft: 'hi' }, { type: 'SEND_MESSAGE', text: 'hi' })
    expect(s.threads.haku.at(-1)).toEqual({ from: 'me', text: 'hi' })
    expect(s.chatDraft).toBe('')
  })

  it('SET_FILTER merges a patch', () => {
    const s = reducer(initialState, { type: 'SET_FILTER', patch: { maxDist: 5 } })
    expect(s.filters.maxDist).toBe(5)
    expect(s.filters.species).toBe('all')
  })

  it('ADVANCE_STORY walks pics then closes', () => {
    let s = reducer(initialState, { type: 'OPEN_STORY', idx: 2 })
    expect(s.story).toEqual({ idx: 2, pic: 0 })
    s = reducer(s, { type: 'ADVANCE_STORY' }) // pic 1
    s = reducer(s, { type: 'ADVANCE_STORY' }) // pic 2
    s = reducer(s, { type: 'ADVANCE_STORY' }) // past last → close
    expect(s.story).toBeNull()
  })

  it('NAVIGATE clears overlays', () => {
    const dirty = { ...initialState, detailId: 'haku', showFilters: true }
    const s = reducer(dirty, { type: 'NAVIGATE', screen: 'profile' })
    expect(s.screen).toBe('profile')
    expect(s.detailId).toBeNull()
    expect(s.showFilters).toBe(false)
  })

  it('RETAKE_QUIZ resets prefs and step', () => {
    const dirty = { ...initialState, prefs: { species: 'dog' }, obStep: 2 }
    const s = reducer(dirty, { type: 'RETAKE_QUIZ' })
    expect(s.screen).toBe('onboarding')
    expect(s.prefs).toEqual({})
    expect(s.obStep).toBe(0)
  })

  it('LOGOUT resets to login and clears credentials', () => {
    const dirty = { ...initialState, screen: 'profile' as const, login: { name: 'A', email: 'b', pass: 'c' } }
    const s = reducer(dirty, { type: 'LOGOUT' })
    expect(s.screen).toBe('login')
    expect(s.login).toEqual({ name: '', email: '', pass: '' })
  })
})
