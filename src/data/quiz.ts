import type { QuizStep } from '../types'

export const quizSteps: QuizStep[] = [
  {
    title: 'Team Woof or Team Meow?',
    sub: 'No wrong answers. Some furrier than others.',
    key: 'species',
    options: [
      { tag: 'A', big: 'Team Woof', small: 'Dogs are my love language', value: 'dog' },
      { tag: 'B', big: 'Team Meow', small: 'Cats chose me long ago', value: 'cat' },
      { tag: 'C', big: 'Chaos, please', small: 'All fur is good fur', value: 'both' },
    ],
  },
  {
    title: 'What’s home like?',
    sub: 'Be honest — they will find the one couch cushion that is theirs.',
    key: 'home',
    options: [
      { tag: 'A', big: 'Cozy apartment', small: 'Small space, big heart', value: 'apartment' },
      { tag: 'B', big: 'House + yard', small: 'Zoomies infrastructure included', value: 'yard' },
      { tag: 'C', big: 'Wide open spaces', small: 'Basically a nature documentary', value: 'farm' },
    ],
  },
  {
    title: 'Pick your speed.',
    sub: 'Matching energy levels is 90% of cohabitation.',
    key: 'energy',
    options: [
      { tag: 'A', big: 'Couch potato', small: 'Professional nappers only', value: 'chill' },
      { tag: 'B', big: 'Weekend warrior', small: 'Hikes, parks, the occasional puddle', value: 'medium' },
      { tag: 'C', big: 'Zoomies 24:7', small: 'I can keep up. Probably.', value: 'high' },
    ],
  },
]

export const prefLabels: Record<string, string> = {
  dog: 'Team Woof',
  cat: 'Team Meow',
  both: 'All fur welcome',
  apartment: 'Cozy apartment',
  yard: 'House + yard',
  farm: 'Wide open spaces',
  chill: 'Couch potato',
  medium: 'Weekend warrior',
  high: 'Zoomies 24:7',
}
