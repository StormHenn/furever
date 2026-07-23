import { describe, it, expect, beforeEach } from 'vitest'
import { loadAvatar, saveAvatar } from './avatar'

describe('avatar storage', () => {
  beforeEach(() => localStorage.clear())

  it('returns null when nothing is stored', () => {
    expect(loadAvatar()).toBeNull()
  })

  it('round-trips a saved photo', () => {
    saveAvatar('data:image/jpeg;base64,abc')
    expect(loadAvatar()).toBe('data:image/jpeg;base64,abc')
  })

  it('clears the photo when saving null', () => {
    saveAvatar('data:image/jpeg;base64,abc')
    saveAvatar(null)
    expect(loadAvatar()).toBeNull()
  })
})
