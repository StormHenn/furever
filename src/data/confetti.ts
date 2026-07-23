export interface ConfettiBit {
  left: number
  delay: number
  dur: number
  color: string
  round: boolean
  size: number
}

export const confetti: ConfettiBit[] = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 61) % 100,
  delay: (i % 5) * 0.22,
  dur: 2.4 + (i % 4) * 0.5,
  color: ['#c2593c', '#4d8a68', '#d9a441', '#f6f0e3'][i % 4],
  round: i % 3 === 0,
  size: 8 + (i % 3) * 4,
}))
