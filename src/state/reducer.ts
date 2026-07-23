import type { Screen, LoginMode, Prefs, SwipeDir, Filters, StoryPos, Message } from '../types'
import type { Action } from './actions'
import { animals } from '../data/animals'
import { shelterStories } from '../data/stories'
import { MATCH_MODE, START_SCREEN } from '../config'
import { isMatchEligible } from '../lib/matching'
import { initialThread } from '../lib/chat'
import { nextStory } from '../lib/story'
import { loadAvatar } from '../lib/avatar'

export interface AppState {
  screen: Screen
  loginMode: LoginMode
  login: { name: string; email: string; pass: string }
  obStep: number
  prefs: Prefs
  swiped: Record<string, SwipeDir>
  filters: Filters
  detailId: string | null
  showFilters: boolean
  matchId: string | null
  story: StoryPos | null
  chatId: string | null
  threads: Record<string, Message[]>
  chatDraft: string
  avatar: string | null
}

const byId = (id: string) => animals.find((a) => a.id === id)

export const initialState: AppState = {
  screen: START_SCREEN,
  loginMode: 'signin',
  login: { name: '', email: '', pass: '' },
  obStep: 0,
  prefs: {},
  swiped: {},
  filters: { species: 'all', maxDist: 25, maxAge: 12 },
  detailId: null,
  showFilters: false,
  matchId: null,
  story: null,
  chatId: null,
  threads: {},
  chatDraft: '',
  avatar: loadAvatar(),
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen, detailId: null, showFilters: false }
    case 'SET_LOGIN_MODE':
      return { ...state, loginMode: action.mode }
    case 'SET_LOGIN_FIELD':
      return { ...state, login: { ...state.login, [action.field]: action.value } }
    case 'SUBMIT_LOGIN':
      return { ...state, screen: 'onboarding', obStep: 0 }
    case 'LOGOUT':
      return {
        ...state,
        screen: 'login',
        loginMode: 'signin',
        login: { name: '', email: '', pass: '' },
      }
    case 'PICK_QUIZ_OPTION': {
      const prefs = { ...state.prefs, [action.key]: action.value }
      if (state.obStep >= 2) return { ...state, prefs, screen: 'discover', obStep: 0 }
      return { ...state, prefs, obStep: state.obStep + 1 }
    }
    case 'SKIP_QUIZ':
      return { ...state, screen: 'discover', obStep: 0 }
    case 'RETAKE_QUIZ':
      return { ...state, screen: 'onboarding', obStep: 0, prefs: {} }
    case 'SWIPE': {
      const a = byId(action.id)
      const isMatch = action.dir === 'like' && !!a && isMatchEligible(a, MATCH_MODE)
      return {
        ...state,
        swiped: { ...state.swiped, [action.id]: action.dir },
        matchId: isMatch ? action.id : state.matchId,
      }
    }
    case 'RESET_DECK':
      return { ...state, swiped: {}, filters: { species: 'all', maxDist: 25, maxAge: 12 } }
    case 'OPEN_DETAIL':
      return { ...state, detailId: action.id }
    case 'CLOSE_DETAIL':
      return { ...state, detailId: null }
    case 'OPEN_FILTERS':
      return { ...state, showFilters: true }
    case 'CLOSE_FILTERS':
      return { ...state, showFilters: false }
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.patch } }
    case 'OPEN_STORY':
      return { ...state, story: { idx: action.idx, pic: 0 } }
    case 'ADVANCE_STORY': {
      if (!state.story) return state
      const deck = shelterStories[state.story.idx].events.length
      return { ...state, story: nextStory(state.story, deck, shelterStories.length) }
    }
    case 'CLOSE_STORY':
      return { ...state, story: null }
    case 'OPEN_CHAT': {
      const a = byId(action.id)
      const threads = state.threads[action.id]
        ? state.threads
        : { ...state.threads, [action.id]: a ? initialThread(a) : [] }
      return { ...state, threads, chatId: action.id, screen: 'chat', matchId: null, detailId: null }
    }
    case 'BACK_TO_MATCHES':
      return { ...state, screen: 'matches' }
    case 'SET_DRAFT':
      return { ...state, chatDraft: action.value }
    case 'SEND_MESSAGE': {
      const id = state.chatId
      if (!id || !action.text.trim()) return state
      return {
        ...state,
        threads: { ...state.threads, [id]: [...(state.threads[id] ?? []), { from: 'me', text: action.text.trim() }] },
        chatDraft: '',
      }
    }
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.id]: [...(state.threads[action.id] ?? []), { from: 'them', text: action.text }],
        },
      }
    case 'DISMISS_MATCH':
      return { ...state, matchId: null }
    case 'SET_AVATAR':
      return { ...state, avatar: action.value }
    default:
      return state
  }
}
