import { useEffect, useRef, type PointerEvent, type MouseEvent } from 'react'

// How far a mouse must move before the gesture counts as a scroll-drag
// rather than a click.
const DRAG_THRESHOLD = 4
// Window of recent pointer history (ms) used to gauge the release velocity.
const SAMPLE_WINDOW = 60
// Ignore velocity measured over too short a time base — it's just noise.
const MIN_SPAN = 8
// Release speed (px/ms) below which no momentum kicks in.
const MIN_FLING = 0.3
// Momentum stops once it decays below this speed (px/ms).
const MIN_COAST = 0.02
// Fraction of velocity retained each ~16ms frame — lower feels grippier.
const FRICTION = 0.95

interface Sample {
  t: number
  y: number
}

/**
 * Lets a scrollable element be dragged with a mouse, the way a finger scrolls
 * on a touchscreen — including a momentum flick that coasts to a stop. Touch
 * input is left to the browser's native scrolling so it doesn't move twice.
 *
 * Spread the returned handlers onto the scroll container and attach `ref`.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const raf = useRef(0)
  const drag = useRef({ down: false, moved: false, startY: 0, startTop: 0, samples: [] as Sample[] })

  const stopMomentum = () => {
    if (raf.current) {
      cancelAnimationFrame(raf.current)
      raf.current = 0
    }
  }

  // Never leave a coast running after the component goes away.
  useEffect(() => stopMomentum, [])

  const onPointerDown = (e: PointerEvent<T>) => {
    // Native scrolling already follows a finger; only assist the mouse.
    if (e.pointerType === 'touch' || e.button !== 0) return
    const el = ref.current
    if (!el) return
    stopMomentum() // grabbing halts any coast in progress
    drag.current = {
      down: true,
      moved: false,
      startY: e.clientY,
      startTop: el.scrollTop,
      samples: [{ t: Date.now(), y: e.clientY }],
    }
  }

  const onPointerMove = (e: PointerEvent<T>) => {
    const d = drag.current
    if (!d.down) return
    const el = ref.current
    if (!el) return
    const dy = e.clientY - d.startY
    if (!d.moved && Math.abs(dy) > DRAG_THRESHOLD) {
      d.moved = true
      // Keep receiving moves even if the cursor leaves the element.
      try {
        el.setPointerCapture?.(e.pointerId)
      } catch {
        /* not supported in some environments (e.g. jsdom) */
      }
    }
    if (d.moved) el.scrollTop = d.startTop - dy
    const now = Date.now()
    d.samples.push({ t: now, y: e.clientY })
    while (d.samples.length > 2 && now - d.samples[0].t > SAMPLE_WINDOW) d.samples.shift()
  }

  const onPointerUp = () => {
    const d = drag.current
    d.down = false
    const el = ref.current
    if (el && d.moved) fling(el, d.samples)
  }

  const fling = (el: T, samples: Sample[]) => {
    const first = samples[0]
    const last = samples[samples.length - 1]
    const span = last.t - first.t
    if (span < MIN_SPAN) return
    // Dragging the finger up (y decreasing) scrolls down (scrollTop up).
    let v = -(last.y - first.y) / span
    if (Math.abs(v) < MIN_FLING) return

    let prev = 0
    const tick = (t: number) => {
      const dt = prev ? Math.min(32, t - prev) : 16
      prev = t
      v *= Math.pow(FRICTION, dt / 16)
      const next = el.scrollTop + v * dt
      const max = el.scrollHeight - el.clientHeight
      if (next <= 0) return void (el.scrollTop = 0)
      if (max > 0 && next >= max) return void (el.scrollTop = max)
      el.scrollTop = next
      if (Math.abs(v) > MIN_COAST) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }

  const onClickCapture = (e: MouseEvent<T>) => {
    // Swallow the click a drag would otherwise trigger on a child element.
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  return { ref, onPointerDown, onPointerMove, onPointerUp, onClickCapture }
}
