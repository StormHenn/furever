import { describe, it, expect } from 'vitest'
import { initialThread, replyFor } from './chat'
import type { Animal } from '../types'

const a = { name: 'Haku', shelter: 'Happy Tails Rescue' } as Animal

describe('initialThread', () => {
  it('opens with a shelter greeting mentioning the animal', () => {
    const t = initialThread(a)
    expect(t).toHaveLength(1)
    expect(t[0].from).toBe('them')
    expect(t[0].text).toContain('Haku')
    expect(t[0].text).toContain('Happy Tails Rescue')
  })
})

describe('replyFor', () => {
  it('returns the first reply for the first user message', () => {
    expect(replyFor(a, 1)).toContain('Haku')
  })
  it('clamps to the last reply for many messages', () => {
    expect(replyFor(a, 99)).toContain('Haku')
  })
  it('never throws for zero', () => {
    expect(typeof replyFor(a, 0)).toBe('string')
  })
})
