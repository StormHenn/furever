import type { Screen, LoginMode, LoginField, PrefKey, SwipeDir, Filters } from '../types'

export type Action =
  | { type: 'NAVIGATE'; screen: Screen }
  | { type: 'SET_LOGIN_MODE'; mode: LoginMode }
  | { type: 'SET_LOGIN_FIELD'; field: LoginField; value: string }
  | { type: 'SUBMIT_LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'PICK_QUIZ_OPTION'; key: PrefKey; value: string }
  | { type: 'SKIP_QUIZ' }
  | { type: 'RETAKE_QUIZ' }
  | { type: 'SWIPE'; id: string; dir: SwipeDir }
  | { type: 'RESET_DECK' }
  | { type: 'OPEN_DETAIL'; id: string }
  | { type: 'CLOSE_DETAIL' }
  | { type: 'OPEN_FILTERS' }
  | { type: 'CLOSE_FILTERS' }
  | { type: 'SET_FILTER'; patch: Partial<Filters> }
  | { type: 'OPEN_STORY'; idx: number }
  | { type: 'ADVANCE_STORY' }
  | { type: 'CLOSE_STORY' }
  | { type: 'OPEN_CHAT'; id: string }
  | { type: 'BACK_TO_MATCHES' }
  | { type: 'SET_DRAFT'; value: string }
  | { type: 'SEND_MESSAGE'; text: string }
  | { type: 'RECEIVE_MESSAGE'; id: string; text: string }
  | { type: 'DISMISS_MATCH' }
  | { type: 'SET_AVATAR'; value: string | null }
