import { useApp } from '../state/AppContext'
import { shelterStories } from '../data/stories'
import { storyPhoto } from '../assets/pets'
import { AnimalPhoto } from '../components/AnimalPhoto'

export function StoryViewer() {
  const { state, dispatch } = useApp()

  if (!state.story) return null

  const { idx, pic } = state.story
  const story = shelterStories[idx]

  return (
    <div
      className="absolute inset-0 z-[60] flex animate-fade-in cursor-pointer flex-col bg-[#1c1712]"
      onClick={() => dispatch({ type: 'ADVANCE_STORY' })}
    >
      <div className="flex gap-[5px] px-3.5 pb-2 pt-3">
        {[0, 1, 2].map((p) => (
          <span
            key={p}
            className="block h-[3px] flex-1 overflow-hidden rounded-full bg-paper/25"
          >
            <span
              className="block h-full rounded-full bg-paper"
              style={{
                width: p < pic ? '100%' : p === pic ? '0%' : '0%',
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
        <span className="font-mono text-[9px] text-paper/50">{story.when}</span>
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
        <AnimalPhoto src={storyPhoto(idx)} name={story.shelter} shape="rounded" radius={16} />
      </div>

      <div className="mx-[18px] mb-[26px] mt-3.5 -rotate-[0.8deg] rounded-2xl border-[1.5px] border-ink bg-paper px-4 py-3 shadow-paper">
        <div className="font-display text-base text-ink">{story.note}</div>
        <div className="mt-1 font-mono text-[9px] tracking-[0.12em] text-ink/55">
          TAP TO CONTINUE
        </div>
      </div>
    </div>
  )
}
