import type { StoryPos } from '../types'

/** Advance within a deck of `picCount` slides, then roll to the next of
 *  `storyCount` agencies; returns null when the whole run is over. */
export function nextStory(pos: StoryPos, picCount: number, storyCount: number): StoryPos | null {
  if (pos.pic < picCount - 1) return { idx: pos.idx, pic: pos.pic + 1 }
  if (pos.idx + 1 < storyCount) return { idx: pos.idx + 1, pic: 0 }
  return null
}
