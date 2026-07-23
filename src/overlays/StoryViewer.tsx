import { useApp } from '../state/AppContext'
import { shelterStories } from '../data/stories'
import { AnimalPhoto } from '../components/AnimalPhoto'

export function StoryViewer() {
  const { state, dispatch } = useApp()

  if (!state.story) return null

  const { idx, pic } = state.story
  const story = shelterStories[idx]
  const slide = story.events[pic]

  return (
    <div
      className="absolute inset-0 z-[60] flex animate-fade-in cursor-pointer flex-col bg-[#1c1712]"
      onClick={() => dispatch({ type: 'ADVANCE_STORY' })}
    >
      <div data-testid="story-bars" className="flex gap-[5px] px-3.5 pb-2 pt-3">
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
