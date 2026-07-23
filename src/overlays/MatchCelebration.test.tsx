import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { MatchCelebration } from './MatchCelebration'

function Open() {
  const { state, dispatch } = useApp()
  useEffect(() => { dispatch({ type: 'SWIPE', id: 'biscuit', dir: 'like' }) }, [])
  return (<><MatchCelebration /><output>screen:{state.screen} match:{state.matchId ?? '-'}</output></>)
}

describe('MatchCelebration', () => {
  it('appears when a mutual animal is liked', () => {
    render(<AppProvider><Open /></AppProvider>)
    expect(screen.getByText('A pawfect match!')).toBeInTheDocument()
    expect(screen.getByText(/You and Haku faved each other/)).toBeInTheDocument()
  })

  it('SEND THE FIRST WOOF opens chat', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByText('SEND THE FIRST WOOF'))
    expect(screen.getByText(/screen:chat/)).toBeInTheDocument()
  })

  it('KEEP SWIPING dismisses', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByText('KEEP SWIPING (PLAYER)'))
    expect(screen.getByText(/match:-/)).toBeInTheDocument()
  })
})
