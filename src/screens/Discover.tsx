import { useRef } from 'react'
import { useApp } from '../state/AppContext'
import { animals } from '../data/animals'
import { shelterStories } from '../data/stories'
import { SwipeCard } from '../components/SwipeCard'
import { AgencyEmblem } from '../components/AgencyEmblem'
import { Heart } from '../components/Heart'
import { selectDeck, selectScore, selectTopId } from '../state/selectors'
import { activeFilterCount } from '../lib/filters'
import type { SwipeDir } from '../types'

export function Discover() {
  const { state, dispatch } = useApp()
  const deck = selectDeck(state)
  const topId = selectTopId(state)
  const count = activeFilterCount(state.filters)
  const topCardRef = useRef<{ fly: (dir: SwipeDir) => void }>(null)
  const positionOf = (id: string) => {
    const i = deck.findIndex((a) => a.id === id)
    return i < 0 || i > 2 ? -1 : i
  }
  const swipeTop = (dir: SwipeDir) => {
    if (topCardRef.current) topCardRef.current.fly(dir)
    else if (topId) dispatch({ type: 'SWIPE', id: topId, dir })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-5 pb-1 pt-2.5">
        <div className="flex flex-col">
          <div className="-rotate-[1.5deg] font-display text-[27px]">furever<span className="text-rust">.</span></div>
          <div className="font-mono text-[8.5px] tracking-[0.28em] text-ink/55">SWIPE · SMOOSH · ADOPT</div>
        </div>
        <button
          onClick={() => dispatch({ type: 'OPEN_FILTERS' })}
          className="rotate-[1.5deg] rounded-full border-[1.5px] border-ink bg-card px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.14em] shadow-[2px_3px_0_rgba(42,33,24,0.15)] active:scale-95"
        >
          FILTERS · {count === 0 ? 'OFF' : count}
        </button>
      </div>

      <div className="flex gap-3.5 overflow-x-auto px-5 pb-1.5 pt-3">
        {shelterStories.map((s, i) => (
          <button key={s.id} onClick={() => dispatch({ type: 'OPEN_STORY', idx: i })} className="flex flex-none flex-col items-center gap-1.5 active:scale-95">
            <span className="block h-[58px] w-[58px] -rotate-3 rounded-full border-2 border-dashed border-rust p-[3px]">
              <AgencyEmblem mono={s.mono} tint={s.tint} />
            </span>
            <span className="max-w-[64px] truncate font-mono text-[8.5px] tracking-[0.06em] text-ink/70">{s.short}</span>
          </button>
        ))}
      </div>

      <div className="relative mx-5 mb-10 mt-2 min-h-0 flex-1">
        {animals.map((a) => {
          const position = positionOf(a.id)
          return (
            <SwipeCard
              key={a.id}
              ref={position === 0 ? topCardRef : undefined}
              animal={a}
              score={selectScore(state, a)}
              position={position}
              onCommit={(dir) => dispatch({ type: 'SWIPE', id: a.id, dir })}
              onOpenDetail={() => dispatch({ type: 'OPEN_DETAIL', id: a.id })}
            />
          )
        })}
        {deck.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 px-[30px] text-center">
            <div className="flex h-[74px] w-[74px] -rotate-6 items-center justify-center rounded-full border-2 border-dashed border-ink/40 font-display text-[26px] text-ink/40">?</div>
            <div className="font-display text-[21px] [text-wrap:pretty]">That's every floof in range.</div>
            <div className="text-[13.5px] text-ink/60">Widen your filters, cupid — love knows no radius.</div>
            <button onClick={() => dispatch({ type: 'RESET_DECK' })} className="rounded-full bg-ink px-5 py-[11px] font-mono text-[11px] font-semibold tracking-[0.12em] text-paper active:scale-95">
              RE-DEAL THE DECK
            </button>
          </div>
        )}
      </div>

      <div className="relative z-[5] flex items-center justify-center gap-[22px] pb-[18px]">
        <button aria-label="Pass" onClick={() => swipeTop('nope')} className="h-[58px] w-[58px] rounded-full border-[1.5px] border-ink bg-card text-[22px] text-nope shadow-paper active:scale-90">✕</button>
        <button aria-label="Details" onClick={() => topId && dispatch({ type: 'OPEN_DETAIL', id: topId })} className="h-11 w-11 rounded-full border-[1.5px] border-dashed border-ink bg-card font-display text-[17px] active:scale-90">i</button>
        <button aria-label="Like" onClick={() => swipeTop('like')} className="h-[66px] w-[66px] rounded-full border-[1.5px] border-ink bg-rust text-[26px] text-paper shadow-paper hover:animate-wiggle active:scale-90"><Heart size="1.05em" className="align-middle" /></button>
      </div>
    </div>
  )
}
