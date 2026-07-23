import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { StoryViewer } from './StoryViewer'

// Opens agency 0 and advances `steps` slides before rendering assertions run.
function Open({ steps = 0 }: { steps?: number }) {
  const { state, dispatch } = useApp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch({ type: 'OPEN_STORY', idx: 0 })
    for (let i = 0; i < steps; i++) dispatch({ type: 'ADVANCE_STORY' })
  }, [])
  return (
    <>
      <StoryViewer />
      <output>story:{state.story ? `${state.story.idx}-${state.story.pic}` : 'none'}</output>
    </>
  )
}

describe('StoryViewer', () => {
  it('renders one progress segment per slide in the deck', () => {
    render(<AppProvider><Open /></AppProvider>)
    // Happy Tails has 4 slides.
    expect(screen.getByTestId('story-bars').children).toHaveLength(4)
  })

  it('shows the upcoming flyer for an upcoming slide', () => {
    render(<AppProvider><Open /></AppProvider>)
    expect(screen.getByText(/UPCOMING/)).toBeInTheDocument()
    expect(screen.getByText('SAT · SEP 14')).toBeInTheDocument()
    expect(screen.getByText('RSVP →')).toBeInTheDocument()
  })

  it('shows the recap for a recap slide', () => {
    render(<AppProvider><Open steps={1} /></AppProvider>)
    expect(screen.getByText(/RECAP/)).toBeInTheDocument()
    expect(screen.getByText('14 ADOPTED')).toBeInTheDocument()
  })

  it('RSVP button does not advance the story', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByText('RSVP →'))
    expect(screen.getByText('story:0-0')).toBeInTheDocument()
  })

  it('close ✕ dismisses the story', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByLabelText('Close story'))
    expect(screen.getByText('story:none')).toBeInTheDocument()
  })
})
