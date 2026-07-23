import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useApp } from '../state/AppContext'
import { shelterStories } from '../data/stories'
import { AnimalPhoto } from '../components/AnimalPhoto'

const SLIDE_MS = 6000
// A press held longer than this is a pause, not a tap that advances the story.
const HOLD_MS = 200
// A downward drag past this many pixels dismisses the story.
const SWIPE_CLOSE_PX = 60

export function StoryViewer() {
  const { state, dispatch } = useApp()
  const [paused, setPaused] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [snapping, setSnapping] = useState(false)

  const open = state.story
  const key = open ? `${open.idx}-${open.pic}` : ''
  const remainingRef = useRef(SLIDE_MS)
  const pressStart = useRef(0)
  const startY = useRef(0)
  const moved = useRef(false)

  // Give each slide a fresh countdown (but leave it alone on pause/resume),
  // and clear any drag when the story changes or closes.
  useEffect(() => {
    remainingRef.current = SLIDE_MS
    setPaused(false)
    setDragY(0)
    setSnapping(false)
  }, [key])

  // Auto-advance every 6s, pausable. Pausing banks the elapsed time so the
  // next resume continues the countdown from where it left off.
  useEffect(() => {
    if (!open || paused) return
    const start = Date.now()
    const timer = window.setTimeout(() => dispatch({ type: 'ADVANCE_STORY' }), remainingRef.current)
    return () => {
      window.clearTimeout(timer)
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - start))
    }
  }, [open, paused, key, dispatch])

  if (!open) return null

  const story = shelterStories[open.idx]
  const pic = open.pic
  const slide = story.events[pic]

  const hold = (e: PointerEvent) => {
    pressStart.current = Date.now()
    startY.current = e.clientY
    moved.current = false
    // Keep the move stream even if the finger wanders off the overlay.
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ignore */ }
    setSnapping(false)
    setPaused(true)
  }
  const drag = (e: PointerEvent) => {
    if (!paused) return
    // Follow the finger downward only; ignore upward pull.
    const dy = Math.max(0, e.clientY - startY.current)
    if (dy > 8) moved.current = true
    setDragY(dy)
  }
  const release = () => {
    // Pulled down far enough: dismiss. Otherwise ease back into place.
    if (dragY > SWIPE_CLOSE_PX) {
      dispatch({ type: 'CLOSE_STORY' })
      return
    }
    setSnapping(true)
    setDragY(0)
    setPaused(false)
  }
  const handleClick = () => {
    // A drag or a held press only pauses; a quick, still tap advances.
    if (moved.current || Date.now() - pressStart.current > HOLD_MS) return
    dispatch({ type: 'ADVANCE_STORY' })
  }

  const dragProgress = Math.min(1, dragY / 240)
  const overlayStyle = {
    // The pull-down is ours to drive; without this the browser claims the
    // vertical pan as a scroll and cancels the pointer mid-drag.
    touchAction: 'none' as const,
    transform: `translateY(${dragY}px) scale(${(1 - dragProgress * 0.12).toFixed(3)})`,
    borderRadius: dragY > 0 ? `${Math.round(dragProgress * 28)}px` : undefined,
    transition: snapping ? 'transform 0.28s ease-out, border-radius 0.28s ease-out' : undefined,
  }

  return (
    <div
      data-testid="story-viewer"
      className="no-callout absolute inset-0 z-[60] flex animate-fade-in cursor-pointer select-none flex-col overflow-hidden bg-[#1c1712]"
      style={overlayStyle}
      onPointerDown={hold}
      onPointerMove={drag}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onClick={handleClick}
    >
      <div data-testid="story-bars" className="flex gap-[5px] px-3.5 pb-2 pt-[calc(env(safe-area-inset-top,0px)+12px)]">
        {story.events.map((_, p) => (
          <span
            key={p}
            className="block h-[3px] flex-1 overflow-hidden rounded-full bg-paper/25"
          >
            <span
              className="block h-full rounded-full bg-paper"
              style={{
                width: p < pic ? '100%' : '0%',
                animation: p === pic ? 'storybar 6s linear forwards' : undefined,
                animationPlayState: p === pic && paused ? 'paused' : undefined,
              }}
            />
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2.5 px-4 pb-2.5 pt-1">
        <span className="font-mono text-[10px] tracking-[0.14em] text-paper">
          {story.shelter.toUpperCase()}
        </span>
        <button
          aria-label="Close story"
          onClick={(e) => {
            e.stopPropagation()
            dispatch({ type: 'CLOSE_STORY' })
          }}
          className="ml-auto text-base text-paper"
        >
          ✕
        </button>
      </div>

      <div className="relative mx-3.5 flex-1">
        <AnimalPhoto id={slide.photoId} name={story.shelter} shape="rounded" radius={16} />
        {/* A pane of glass over the photo: the slide reads as one card, and no
            touch can reach the image to start an iOS lift or a copy menu. */}
        <div data-testid="story-photo-shield" className="absolute inset-0 rounded-2xl" />
      </div>

      {slide.kind === 'upcoming' ? (
        <div className="mx-[18px] mb-[26px] mt-3.5 -rotate-[0.8deg] rounded-2xl border-[1.5px] border-ink bg-paper px-4 py-3 shadow-paper">
          <div className="font-mono text-[9px] tracking-[0.16em] text-rust">
            UPCOMING · {slide.title ?? 'ADOPTION DAY'}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[10px] text-ink/70">
            {slide.day && <span>{slide.day}</span>}
            {slide.time && <span>{slide.time}</span>}
            {slide.place && <span>{slide.place}</span>}
          </div>
          {slide.pitch && (
            <div className="mt-1.5 font-display text-base text-ink">{slide.pitch}</div>
          )}
          <button
            onClick={(e) => e.stopPropagation()}
            className="mt-2.5 rounded-full border-[1.5px] border-ink bg-rust px-3.5 py-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-paper active:scale-95"
          >
            RSVP →
          </button>
        </div>
      ) : (
        <div className="mx-[18px] mb-[26px] mt-3.5 rotate-[0.6deg] rounded-2xl border-[1.5px] border-ink bg-paper px-4 py-3 shadow-paper">
          <div className="font-mono text-[9px] tracking-[0.16em] text-sage">
            RECAP · {slide.title ?? 'THAT WAS FUN'}
          </div>
          {slide.stat && <div className="mt-1 font-display text-2xl text-ink">{slide.stat}</div>}
          {slide.crowd && <div className="font-mono text-[10px] text-ink/60">{slide.crowd}</div>}
          {slide.thanks && (
            <div className="mt-1.5 font-display text-base text-ink">{slide.thanks}</div>
          )}
        </div>
      )}
    </div>
  )
}
