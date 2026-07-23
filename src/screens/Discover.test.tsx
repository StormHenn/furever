import { useEffect } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { AppProvider, useApp } from '../state/AppContext'
import { Discover } from './Discover'

function Harness() {
  const { state } = useApp()
  return (<><Discover /><output>liked:{Object.values(state.swiped).filter((d) => d === 'like').length} detail:{state.detailId ?? '-'}</output></>)
}

describe('Discover', () => {
  it('renders the deck with the top card visible', () => {
    render(<AppProvider><Discover /></AppProvider>)
    // first deck animal is "Haku" (haku)
    expect(screen.getAllByText('Haku').length).toBeGreaterThan(0)
  })

  it('draws the like heart as artwork, not the U+2665 character', () => {
    render(<AppProvider><Discover /></AppProvider>)
    const like = screen.getByLabelText('Like')
    // iOS renders `♥` through Apple Color Emoji, which ignores CSS colour and
    // shows red where the button asks for paper. Ours has to be a real shape.
    expect(like.querySelector('svg')).not.toBeNull()
    expect(like.textContent).not.toContain('♥')
  })

  it('the like button records a like on the top card', () => {
    vi.useFakeTimers()
    try {
      render(<AppProvider><Harness /></AppProvider>)
      act(() => {
        fireEvent.click(screen.getByLabelText('Like'))
        vi.advanceTimersByTime(320)
      })
      expect(screen.getByText(/liked:1/)).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('the info button opens detail for the top card', () => {
    render(<AppProvider><Harness /></AppProvider>)
    fireEvent.click(screen.getByLabelText('Details'))
    expect(screen.getByText(/detail:haku/)).toBeInTheDocument()
  })

  it('shows the empty state after every animal is swiped', () => {
    // set a narrow filter that excludes everyone via the store
    render(<AppProvider><EmptyHarness /></AppProvider>)
    expect(screen.getByText("That's every floof in range.")).toBeInTheDocument()
  })

  it('shows agency monograms in the story ring', () => {
    render(<AppProvider><Discover /></AppProvider>)
    expect(screen.getByText('HT')).toBeInTheDocument()
    expect(screen.getByText('WH')).toBeInTheDocument()
    expect(screen.getByText('PE')).toBeInTheDocument()
  })
})

function EmptyHarness() {
  // narrow distance below the closest animal → empty deck
  return (
    <>
      <Discover />
      <Trigger />
    </>
  )
}
function Trigger() {
  const { state, dispatch } = useApp()
  useEffect(() => {
    if (state.filters.maxDist !== 0) dispatch({ type: 'SET_FILTER', patch: { maxDist: 0 } })
  }, [state.filters.maxDist, dispatch])
  return null
}
