import type { StoryPos } from '../types'

/** 3 pics per story; returns the next position, or null when the run is over. */
export function nextStory(pos: StoryPos, storyCount: number): StoryPos | null {
  if (pos.pic < 2) return { idx: pos.idx, pic: pos.pic + 1 }
  if (pos.idx + 1 < storyCount) return { idx: pos.idx + 1, pic: 0 }
  return null
}
