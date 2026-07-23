export type Species = 'dog' | 'cat'
export type Compat = 'YES' | 'NO' | 'ASK'

export interface Animal {
  id: string
  name: string
  species: Species
  breed: string
  age: number
  dist: number
  shelter: string
  fee: string
  score: number
  mutual: boolean
  tags: string[]
  kids: Compat
  dogs: Compat
  cats: Compat
  bio: string
}

export interface ShelterStory {
  id: string
  shelter: string
  short: string
  when: string
  note: string
}

export type Screen = 'login' | 'onboarding' | 'discover' | 'matches' | 'chat' | 'profile'
export type MatchMode = 'destiny' | 'every-like' | 'never'
export type SwipeDir = 'like' | 'nope'
export type LoginMode = 'signin' | 'register'
export type LoginField = 'name' | 'email' | 'pass'

export interface Message {
  from: 'me' | 'them'
  text: string
}

export type PrefKey = 'species' | 'home' | 'energy'
export type Prefs = Partial<Record<PrefKey, string>>

export interface Filters {
  species: 'all' | Species
  maxDist: number
  maxAge: number
}

export interface QuizOption {
  tag: string
  big: string
  small: string
  value: string
}

export interface QuizStep {
  title: string
  sub: string
  key: PrefKey
  options: QuizOption[]
}

export interface StoryPos {
  idx: number
  pic: number
}
