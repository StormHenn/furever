import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { Matches } from './Matches'

function Seed({ likes }: { likes: string[] }) {
  const { state, dispatch } = useApp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { likes.forEach((id) => dispatch({ type: 'SWIPE', id, dir: 'like' })) }, [])
  return (<><Matches /><output>screen:{state.screen} chat:{state.chatId ?? '-'}</output></>)
}

describe('Matches', () => {
  it('shows the empty state with no likes', () => {
    render(<AppProvider><Matches /></AppProvider>)
    expect(screen.getByText('Nobody faved. Yet.')).toBeInTheDocument()
  })

  it('lists a mutual and opens chat', () => {
    render(<AppProvider><Seed likes={['haku']} /></AppProvider>)
    expect(screen.getByText('MUTUAL SPARKS ♥')).toBeInTheDocument()
    fireEvent.click(screen.getAllByText('CHAT')[0])
    expect(screen.getByText(/screen:chat/)).toBeInTheDocument()
    expect(screen.getByText(/chat:haku/)).toBeInTheDocument()
  })

  it('lists a non-mutual like under the shortlist', () => {
    render(<AppProvider><Seed likes={['moon-cake']} /></AppProvider>)
    expect(screen.getByText('FAVED, AWAITING SPARKS')).toBeInTheDocument()
    expect(screen.getByText('Moon Cake')).toBeInTheDocument()
  })
})
