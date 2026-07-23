import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { Profile } from './Profile'

function Seed() {
  const { state, dispatch } = useApp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dispatch({ type: 'SWIPE', id: 'haku', dir: 'like' }); dispatch({ type: 'SWIPE', id: 'moon-cake', dir: 'nope' }) }, [])
  return (<><Profile /><output>screen:{state.screen}</output></>)
}

describe('Profile', () => {
  it('shows stats reflecting swipes', () => {
    render(<AppProvider><Seed /></AppProvider>)
    expect(screen.getByText('MET')).toBeInTheDocument()
    expect(screen.getByText('SMITTEN')).toBeInTheDocument()
    // 1 like + 1 nope = 2 met
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('logout returns to login', () => {
    render(<AppProvider><Seed /></AppProvider>)
    fireEvent.click(screen.getByText('LOG OUT (THE FLOOFS WILL WAIT)'))
    expect(screen.getByText(/screen:login/)).toBeInTheDocument()
  })
})
