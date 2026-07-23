import { useApp } from '../state/AppContext'
import { animals } from '../data/animals'
import { confetti } from '../data/confetti'
import { AnimalPhoto } from '../components/AnimalPhoto'
import { Heart } from '../components/Heart'

export function MatchCelebration() {
  const { state, dispatch } = useApp()
  const animal = animals.find((a) => a.id === state.matchId)

  if (!animal) return null

  return (
    <div className="absolute inset-0 z-[70] flex animate-fade-in items-center justify-center overflow-hidden bg-ink/55">
      {confetti.map((c, i) => (
        <span
          key={i}
          className="pointer-events-none absolute -top-[60px]"
          style={{
            left: `${c.left}%`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            background: c.color,
            borderRadius: c.round ? '50%' : undefined,
            animation: `fall ${c.dur}s linear ${c.delay}s infinite`,
          }}
        />
      ))}

      <div className="w-[82%] -rotate-2 rounded-[20px] border-[1.5px] border-ink bg-paper px-[22px] pb-6 pt-7 text-center shadow-paper animate-pop-in">
        <div className="font-mono text-[9px] font-semibold tracking-[0.3em] text-rust">
          STOP THE PRESSES
        </div>
        <div className="my-2.5 text-[33px] leading-[1.1] font-display text-ink [text-wrap:pretty]">
          A pawfect match!
        </div>
        <div className="text-[13.5px] leading-[1.5] text-ink/65">
          You and {animal.name} faved each other.
          <br />
          Coincidence? {animal.shelter} thinks not.
        </div>

        <div className="my-5 flex items-center justify-center gap-0">
          <span className="-rotate-6 rounded-full border-2 border-dashed border-rust bg-paper p-[3px]">
            <span className="block h-[84px] w-[84px]">
              <AnimalPhoto name="You" src={state.avatar ?? undefined} shape="circle" />
            </span>
          </span>
          <span className="relative z-[2] mx-[-6px] font-display text-2xl text-rust"><Heart /></span>
          <span className="rotate-6 rounded-full border-2 border-dashed border-sage bg-paper p-[3px]">
            <span className="block h-[84px] w-[84px]">
              <AnimalPhoto id={animal.id} name={animal.name} shape="circle" />
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'OPEN_CHAT', id: animal.id })}
          className="w-full rounded-full border-[1.5px] border-ink bg-rust py-[13px] font-mono text-[11.5px] font-semibold tracking-[0.12em] text-paper shadow-paper active:scale-[0.97]"
        >
          SEND THE FIRST WOOF
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'DISMISS_MATCH' })}
          className="mt-2.5 w-full border-none bg-transparent font-mono text-[10.5px] tracking-[0.12em] text-ink/55 underline"
        >
          KEEP SWIPING (PLAYER)
        </button>
      </div>
    </div>
  )
}
