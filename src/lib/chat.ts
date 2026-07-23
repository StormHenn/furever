import type { Animal, Message } from '../types'

export function initialThread(a: Animal): Message[] {
  return [
    {
      from: 'them',
      text: `Hi! This is ${a.shelter} — ${a.name} just did a happy dance. How can we help you two meet?`,
    },
  ]
}

export function replyFor(a: Animal, myMessageCount: number): string {
  const replies = [
    `Great question! ${a.name} is available for meet-and-greets all week — want us to pencil you in?`,
    `We can confirm ${a.name} is 10/10. Come by ${a.shelter} anytime before 6pm!`,
    `Paperwork takes ~20 minutes and ${a.name} will supervise the whole thing.`,
  ]
  const idx = Math.min(Math.max(0, myMessageCount - 1), replies.length - 1)
  return replies[idx]
}
