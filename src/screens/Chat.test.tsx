import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { Chat } from './Chat'
import { useAutoReply } from '../hooks/useAutoReply'

function Harness() {
  const { dispatch } = useApp()
  useAutoReply()
  useEffect(() => { dispatch({ type: 'OPEN_CHAT', id: 'biscuit' }) }, [])
  return <Chat />
}

describe('Chat', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows the seeded greeting and quick replies', () => {
    render(<AppProvider><Harness /></AppProvider>)
    expect(screen.getByText(/just did a happy dance/)).toBeInTheDocument()
    expect(screen.getByText('When can I visit?')).toBeInTheDocument()
  })

  it('sending a message appends it and triggers an auto-reply', () => {
    render(<AppProvider><Harness /></AppProvider>)
    fireEvent.click(screen.getByText('Tell me everything.'))
    expect(screen.getByText('Tell me everything.')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText(/meet-and-greets all week/)).toBeInTheDocument()
  })
})
