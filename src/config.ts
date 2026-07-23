import type { Screen, MatchMode } from './types'

/** Where the app opens. Design-tool default: 'login'. */
export const START_SCREEN: Screen = 'login'

/**
 * When a "like" triggers a match celebration.
 * 'destiny' → only animals flagged mutual. 'every-like' → always. 'never' → off.
 */
export const MATCH_MODE: MatchMode = 'destiny'

/** Playful rotation on cards/chips. */
export const TILT = true
