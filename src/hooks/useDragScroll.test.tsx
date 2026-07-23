import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useDragScroll } from './useDragScroll'

function Harness({ onButtonClick }: { onButtonClick?: () => void }) {
  const { ref, ...handlers } = useDragScroll<HTMLDivElement>()
  return (
    <div data-testid="scroller" ref={ref} {...handlers}>
      <button onClick={onButtonClick}>tap me</button>
      <div style={{ height: 2000 }} />
    </div>
  )
}

function setup(props: { onButtonClick?: () => void } = {}) {
  render(<Harness {...props} />)
  const el = screen.getByTestId('scroller')
  // jsdom has no layout, so give scrollTop real read/write behaviour and a
  // scrollable range for momentum to travel within.
  Object.defineProperty(el, 'scrollTop', { writable: true, configurable: true, value: 0 })
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: 4000 })
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: 800 })
  return el
}

describe('useDragScroll', () => {
  it('scrolls the container as a mouse drag moves', () => {
    const el = setup()
    fireEvent.pointerDown(el, { clientY: 300, pointerType: 'mouse', button: 0 })
    fireEvent.pointerMove(el, { clientY: 250, pointerType: 'mouse' }) // pulled up 50px
    expect(el.scrollTop).toBe(50)
    fireEvent.pointerMove(el, { clientY: 200, pointerType: 'mouse' }) // 100px from start
    expect(el.scrollTop).toBe(100)
  })

  it('leaves touch scrolling to the browser', () => {
    const el = setup()
    fireEvent.pointerDown(el, { clientY: 300, pointerType: 'touch' })
    fireEvent.pointerMove(el, { clientY: 200, pointerType: 'touch' })
    expect(el.scrollTop).toBe(0)
  })

  it('ignores non-primary mouse buttons', () => {
    const el = setup()
    fireEvent.pointerDown(el, { clientY: 300, pointerType: 'mouse', button: 2 })
    fireEvent.pointerMove(el, { clientY: 200, pointerType: 'mouse' })
    expect(el.scrollTop).toBe(0)
  })

  it('a plain click still fires (movement under threshold)', () => {
    const onButtonClick = vi.fn()
    const el = setup({ onButtonClick })
    fireEvent.pointerDown(el, { clientY: 300, pointerType: 'mouse', button: 0 })
    fireEvent.pointerUp(el, { clientY: 300, pointerType: 'mouse' })
    fireEvent.click(screen.getByText('tap me'))
    expect(onButtonClick).toHaveBeenCalledTimes(1)
  })

  it('suppresses the click that ends a real drag', () => {
    const onButtonClick = vi.fn()
    const el = setup({ onButtonClick })
    fireEvent.pointerDown(el, { clientY: 300, pointerType: 'mouse', button: 0 })
    fireEvent.pointerMove(el, { clientY: 240, pointerType: 'mouse' }) // 60px drag
    fireEvent.pointerUp(el, { clientY: 240, pointerType: 'mouse' })
    fireEvent.click(screen.getByText('tap me'))
    expect(onButtonClick).not.toHaveBeenCalled()
  })
})

describe('useDragScroll momentum', () => {
  beforeEach(() =>
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'Date'] }),
  )
  afterEach(() => vi.useRealTimers())

  // Flick upward: ~80px over 32ms ≈ 2.5px/ms, then release.
  function flick(el: HTMLElement) {
    fireEvent.pointerDown(el, { clientY: 500, pointerType: 'mouse', button: 0 })
    vi.advanceTimersByTime(16)
    fireEvent.pointerMove(el, { clientY: 460, pointerType: 'mouse' })
    vi.advanceTimersByTime(16)
    fireEvent.pointerMove(el, { clientY: 420, pointerType: 'mouse' })
    fireEvent.pointerUp(el, { clientY: 420, pointerType: 'mouse' })
  }

  it('keeps scrolling after a flick, then slows to a stop', () => {
    const el = setup()
    flick(el)
    const released = el.scrollTop
    vi.advanceTimersByTime(60)
    const coasting = el.scrollTop
    expect(coasting).toBeGreaterThan(released) // carried further by momentum

    vi.advanceTimersByTime(3000)
    const settled = el.scrollTop
    vi.advanceTimersByTime(3000)
    expect(el.scrollTop).toBe(settled) // has come to rest
    expect(settled).toBeGreaterThan(coasting)
  })

  it('grabbing again stops the momentum', () => {
    const el = setup()
    flick(el)
    vi.advanceTimersByTime(32)
    const grabbed = el.scrollTop
    fireEvent.pointerDown(el, { clientY: 420, pointerType: 'mouse', button: 0 })
    vi.advanceTimersByTime(1000)
    expect(el.scrollTop).toBe(grabbed) // frozen at the grab point
  })

  it('a slow drag coasts nowhere', () => {
    const el = setup()
    fireEvent.pointerDown(el, { clientY: 500, pointerType: 'mouse', button: 0 })
    vi.advanceTimersByTime(200)
    fireEvent.pointerMove(el, { clientY: 480, pointerType: 'mouse' })
    vi.advanceTimersByTime(200)
    fireEvent.pointerMove(el, { clientY: 470, pointerType: 'mouse' })
    fireEvent.pointerUp(el, { clientY: 470, pointerType: 'mouse' })
    const rest = el.scrollTop
    vi.advanceTimersByTime(1000)
    expect(el.scrollTop).toBe(rest) // no drift
  })
})
