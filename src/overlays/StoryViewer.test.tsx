import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
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

describe('StoryViewer treats the whole slide as one card', () => {
  it('covers the photo with a shield so the finger never touches the image', () => {
    render(<AppProvider><Open /></AppProvider>)
    // iOS peels a long-pressed <img> off the page and cancels the pointer
    // stream mid-gesture, which killed the swipe-down. Nothing may reach it.
    expect(screen.getByTestId('story-photo-shield')).toBeInTheDocument()
    expect(screen.getByRole('img').style.pointerEvents).toBe('none')
  })

  it('a press that the OS cancels mid-drag still dismisses once past the threshold', () => {
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    fireEvent.pointerDown(overlay, { clientY: 100 })
    fireEvent.pointerMove(overlay, { clientY: 220 }) // 120px, past the threshold
    fireEvent.pointerCancel(overlay)
    expect(screen.getByText('story:none')).toBeInTheDocument()
  })
})

describe('StoryViewer press-and-hold to pause', () => {
  afterEach(() => vi.useRealTimers())

  it('holding pauses the auto-advance timer', () => {
    vi.useFakeTimers()
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    act(() => { fireEvent.pointerDown(overlay) })
    act(() => { vi.advanceTimersByTime(6000) })
    // Held down: the story stays put past its normal 6s advance.
    expect(screen.getByText('story:0-0')).toBeInTheDocument()
  })

  it('releasing resumes the countdown from where it paused', () => {
    vi.useFakeTimers()
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    act(() => { vi.advanceTimersByTime(4000) }) // 4s elapsed, 2s remaining
    act(() => { fireEvent.pointerDown(overlay) }) // pause, bank 2s
    act(() => { vi.advanceTimersByTime(10000) }) // paused: nothing moves
    expect(screen.getByText('story:0-0')).toBeInTheDocument()

    act(() => { fireEvent.pointerUp(overlay) }) // resume with 2s left
    act(() => { vi.advanceTimersByTime(1999) })
    expect(screen.getByText('story:0-0')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1) })
    expect(screen.getByText('story:0-1')).toBeInTheDocument()
  })

  it('resumes when the pointer leaves while still held', () => {
    vi.useFakeTimers()
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    act(() => { fireEvent.pointerDown(overlay) })
    act(() => { fireEvent.pointerLeave(overlay) })
    act(() => { vi.advanceTimersByTime(6000) })
    expect(screen.getByText('story:0-1')).toBeInTheDocument()
  })

  it('a quick tap still advances the story', () => {
    vi.useFakeTimers()
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    act(() => { fireEvent.pointerDown(overlay) })
    act(() => { fireEvent.pointerUp(overlay) })
    act(() => { fireEvent.click(overlay) })
    expect(screen.getByText('story:0-1')).toBeInTheDocument()
  })

  it('releasing after a long hold does not advance the story', () => {
    vi.useFakeTimers()
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    act(() => { fireEvent.pointerDown(overlay) })
    act(() => { vi.advanceTimersByTime(500) }) // held well past the tap threshold
    act(() => { fireEvent.pointerUp(overlay) })
    act(() => { fireEvent.click(overlay) })
    expect(screen.getByText('story:0-0')).toBeInTheDocument()
  })
})

describe('StoryViewer swipe down to dismiss', () => {
  it('claims the vertical pan so the browser cannot scroll-steal the gesture', () => {
    render(<AppProvider><Open /></AppProvider>)
    // Without this the browser arbitrates a downward drag as a scroll,
    // fires pointercancel, and the dismiss never reaches its threshold.
    expect(screen.getByTestId('story-viewer').style.touchAction).toBe('none')
  })

  it('captures the pointer so moves keep arriving once the finger strays', () => {
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')
    const capture = vi.fn()
    overlay.setPointerCapture = capture

    fireEvent.pointerDown(overlay, { clientY: 100, pointerId: 7 })
    expect(capture).toHaveBeenCalledWith(7)
  })

  it('the view follows the finger during a downward drag', () => {
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    fireEvent.pointerDown(overlay, { clientY: 100 })
    fireEvent.pointerMove(overlay, { clientY: 180 }) // 80px down
    expect(overlay.style.transform).toContain('translateY(80px)')
  })

  it('releasing past the threshold closes the story', () => {
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    fireEvent.pointerDown(overlay, { clientY: 100 })
    fireEvent.pointerMove(overlay, { clientY: 220 }) // dragged 120px down
    fireEvent.pointerUp(overlay)
    expect(screen.getByText('story:none')).toBeInTheDocument()
  })

  it('a drag released under the threshold snaps back and stays open', () => {
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    fireEvent.pointerDown(overlay, { clientY: 100 })
    fireEvent.pointerMove(overlay, { clientY: 140 }) // 40px < threshold
    fireEvent.pointerUp(overlay)
    expect(screen.getByText('story:0-0')).toBeInTheDocument()
    expect(overlay.style.transform).toContain('translateY(0px)')
  })

  it('swiping up does not move or close the story', () => {
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    fireEvent.pointerDown(overlay, { clientY: 200 })
    fireEvent.pointerMove(overlay, { clientY: 60 }) // dragged up
    expect(overlay.style.transform).toContain('translateY(0px)')
    fireEvent.pointerUp(overlay)
    expect(screen.getByText('story:0-0')).toBeInTheDocument()
  })

  it('a drag does not also register as a tap-advance', () => {
    render(<AppProvider><Open /></AppProvider>)
    const overlay = screen.getByTestId('story-viewer')

    fireEvent.pointerDown(overlay, { clientY: 100 })
    fireEvent.pointerMove(overlay, { clientY: 130 }) // 30px drag, under threshold
    fireEvent.pointerUp(overlay)
    fireEvent.click(overlay)
    expect(screen.getByText('story:0-0')).toBeInTheDocument()
  })
})
