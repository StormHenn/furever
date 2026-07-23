import type { SwipeDir } from '../types'

export const SWIPE_THRESHOLD = 110

export function swipeOutcome(dx: number): SwipeDir | null {
  if (dx > SWIPE_THRESHOLD) return 'like'
  if (dx < -SWIPE_THRESHOLD) return 'nope'
  return null
}
