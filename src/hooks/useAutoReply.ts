import { useEffect } from 'react'
import { useApp } from '../state/AppContext'
import { animals } from '../data/animals'
import { replyFor } from '../lib/chat'

/** After the user sends a message, the shelter replies ~900ms later. */
export function useAutoReply() {
  const { state, dispatch } = useApp()
  const id = state.chatId
  const thread = id ? state.threads[id] : undefined
  const last = thread?.at(-1)

  useEffect(() => {
    if (!id || !thread || last?.from !== 'me') return
    const animal = animals.find((a) => a.id === id)
    if (!animal) return
    const myCount = thread.filter((m) => m.from === 'me').length
    const timer = window.setTimeout(() => {
      dispatch({ type: 'RECEIVE_MESSAGE', id, text: replyFor(animal, myCount) })
    }, 900)
    return () => window.clearTimeout(timer)
    // re-run when the thread length changes
  }, [id, thread?.length, last?.from, dispatch, thread])
}
