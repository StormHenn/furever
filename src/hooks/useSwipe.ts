import { useRef, type PointerEvent } from 'react'
import type { SwipeDir } from '../types'
import { swipeOutcome } from '../lib/swipe'

interface Options {
  enabled: boolean
  onCommit: (dir: SwipeDir) => void
}

export function useSwipe({ enabled, onCommit }: Options) {
  const ref = useRef<HTMLDivElement>(null)
  const start = useRef({ x: 0, y: 0 })
  const dragging = useRef(false)
  const moved = useRef(false)

  const setStamp = (kind: SwipeDir, opacity: number) => {
    const el = ref.current?.querySelector<HTMLElement>(`[data-stamp="${kind}"]`)
    if (el) el.style.opacity = String(opacity)
  }

  const fly = (dir: SwipeDir) => {
    const el = ref.current
    if (!el) {
      onCommit(dir)
      return
    }
    const x = dir === 'like' ? 520 : -520
    el.style.transition = 'transform .32s ease-in, opacity .32s ease-in'
    el.style.transform = `translate(${x}px,-30px) rotate(${dir === 'like' ? 24 : -24}deg)`
    el.style.opacity = '0'
    setStamp(dir, 1)
    window.setTimeout(() => onCommit(dir), 310)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return
    dragging.current = true
    moved.current = false
    start.current = { x: e.clientX, y: e.clientY }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ignore */ }
    e.currentTarget.style.transition = 'none'
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !ref.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    if (Math.abs(dx) + Math.abs(dy) > 7) moved.current = true
    ref.current.style.transform = `translate(${dx}px,${dy}px) rotate(${dx * 0.07}deg)`
    setStamp('like', Math.min(1, Math.max(0, dx / 90)))
    setStamp('nope', Math.min(1, Math.max(0, -dx / 90)))
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    dragging.current = false
    const dx = e.clientX - start.current.x
    const outcome = swipeOutcome(dx)
    if (outcome) {
      fly(outcome)
    } else if (ref.current) {
      ref.current.style.transition = 'transform .45s cubic-bezier(.2,1.6,.4,1)'
      ref.current.style.transform = ''
      setStamp('like', 0)
      setStamp('nope', 0)
    }
  }

  const wasDragged = () => moved.current
  const flyProgrammatic = (dir: SwipeDir) => fly(dir)

  return {
    ref,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    wasDragged,
    flyProgrammatic,
  }
}
