import { useEffect } from 'react'
import { useApp } from '../state/AppContext'

/** Auto-advances the open story every 6s. */
export function useStoryPlayer() {
  const { state, dispatch } = useApp()
  const story = state.story

  useEffect(() => {
    if (!story) return
    const timer = window.setTimeout(() => dispatch({ type: 'ADVANCE_STORY' }), 6000)
    return () => window.clearTimeout(timer)
  }, [story?.idx, story?.pic, story, dispatch])
}
