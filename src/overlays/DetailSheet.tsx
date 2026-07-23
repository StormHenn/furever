import { useApp } from '../state/AppContext'
import { animals, detailCaptions } from '../data/animals'
import { selectScore } from '../state/selectors'
import { AnimalPhoto } from '../components/AnimalPhoto'
import { BottomSheet } from '../components/BottomSheet'
import type { Compat } from '../types'

const compatColor: Record<Compat, string> = {
  YES: 'text-sage',
  NO: 'text-nope',
  ASK: 'text-amber',
}

export function DetailSheet() {
  const { state, dispatch } = useApp()
  const animal = animals.find((a) => a.id === state.detailId)

  if (!animal) return null

  const captions = detailCaptions[animal.id]
  const score = selectScore(state, animal)
  const ageLabel = `${animal.age} ${animal.age === 1 ? 'yr' : 'yrs'} old`
  const distLabel = `${animal.dist} KM`
  const breedLabel = `${animal.breed.toUpperCase()} · ${animal.species === 'dog' ? 'DOG' : 'CAT'}`
  const upperName = animal.name.toUpperCase()
  const compat: { k: string; v: Compat }[] = [
    { k: 'KIDS', v: animal.kids },
    { k: 'DOGS', v: animal.dogs },
    { k: 'CATS', v: animal.cats },
  ]

  return (
    <BottomSheet open onClose={() => dispatch({ type: 'CLOSE_DETAIL' })} height="88%">
      <div className="px-5 pb-6 pt-1.5">
        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="font-display text-[30px]">{animal.name}</span>
          <span className="font-mono text-[13px] text-ink/60">{ageLabel}</span>
          <span className="ml-auto -rotate-2 rounded-full border-[1.5px] border-ink px-2.5 py-1 font-mono text-[10px] tracking-[0.1em]">
            {distLabel}
          </span>
        </div>
        <div className="mt-0.5 font-mono text-[10.5px] font-semibold tracking-[0.14em] text-rust">
          {breedLabel}
        </div>
        <p className="my-3 text-[14.5px] leading-[1.55] text-ink/80">{animal.bio}</p>

        <div className="mb-4 -rotate-[0.5deg] rounded-2xl border-[1.5px] border-ink bg-card p-2.5 shadow-paper">
          <div className="mx-1 mb-2.5 mt-0.5 font-display text-[15px]">{captions[0]}</div>
          <div className="relative h-[230px]">
            <AnimalPhoto id={animal.id} name={animal.name} shape="rounded" />
            <div className="pointer-events-none absolute -top-2 left-5 h-[19px] w-16 -rotate-[5deg] bg-paperdark/85" />
            <div className="pointer-events-none absolute bottom-2.5 right-2.5 flex h-[60px] w-[60px] rotate-[8deg] flex-col items-center justify-center rounded-full border-2 border-dashed border-rust bg-paper">
              <span className="font-display text-[17px] text-rust">{score}</span>
              <span className="font-mono text-[6.5px] tracking-[0.14em] text-rust">% MATCH</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {animal.tags.map((t) => (
            <span
              key={t}
              className="-rotate-1 rounded-full border-[1.5px] border-dashed border-ink bg-card px-3 py-1.5 text-xs"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-[18px] rotate-[0.6deg] rounded-2xl border-[1.5px] border-ink bg-card p-2.5 shadow-paper">
          <div className="mx-1 mb-2.5 mt-0.5 font-display text-[15px]">{captions[1]}</div>
          <div className="relative h-[230px]">
            <AnimalPhoto id={animal.id} name={animal.name} shape="rounded" />
            <div className="pointer-events-none absolute -top-2 right-5 h-[19px] w-16 rotate-[4deg] bg-paperdark/85" />
          </div>
        </div>

        <div className="mb-2.5 mt-5 font-mono text-[9.5px] tracking-[0.2em] text-ink/55">
          THE ROOMMATE REPORT
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {compat.map((c) => (
            <div
              key={c.k}
              className="rounded-xl border-[1.5px] border-ink bg-card px-1.5 py-[11px] text-center shadow-paper"
            >
              <div className="font-mono text-[8.5px] tracking-[0.16em] text-ink/55">{c.k}</div>
              <div className={`mt-0.5 font-display text-[15px] ${compatColor[c.v]}`}>{c.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-[18px] -rotate-[0.4deg] rounded-2xl border-[1.5px] border-ink bg-card p-2.5 shadow-paper">
          <div className="mx-1 mb-2.5 mt-0.5 font-display text-[15px]">{captions[2]}</div>
          <div className="relative h-[230px]">
            <AnimalPhoto id={animal.id} name={animal.name} shape="rounded" />
            <div className="pointer-events-none absolute -top-2 left-5 h-[19px] w-16 -rotate-[4deg] bg-paperdark/85" />
          </div>
        </div>

        <div className="mb-2.5 mt-5 font-mono text-[9.5px] tracking-[0.2em] text-ink/55">
          WHERE TO FIND {upperName}
        </div>
        <div className="overflow-hidden rounded-2xl border-[1.5px] border-ink bg-card shadow-paper">
          <div
            className="flex h-24 items-center justify-center"
            style={{
              backgroundImage:
                'repeating-linear-gradient(-45deg, color-mix(in srgb, var(--color-ink) 6%, transparent) 0 8px, transparent 8px 16px)',
            }}
          >
            <span className="rounded-md border-[1.5px] border-dashed border-ink/40 bg-paper px-2.5 py-[5px] font-mono text-[10px] tracking-[0.12em] text-ink/60">
              MAP &middot; {distLabel} AWAY
            </span>
          </div>
          <div className="flex items-center justify-between px-3.5 py-3">
            <span className="flex flex-col gap-px">
              <span className="font-display text-[15px]">{animal.shelter}</span>
              <span className="font-mono text-[9px] tracking-[0.1em] text-ink/55">
                ADOPTION FEE &middot; {animal.fee}
              </span>
            </span>
            <span className="rotate-[2deg] rounded-full border-[1.5px] border-dashed border-sage px-[9px] py-1 font-mono text-[9px] tracking-[0.1em] text-sage">
              OPEN TODAY
            </span>
          </div>
        </div>

        <button
          onClick={() => dispatch({ type: 'OPEN_CHAT', id: animal.id })}
          className="mt-[18px] w-full rounded-full border-[1.5px] border-ink bg-rust py-[15px] font-mono text-xs font-semibold tracking-[0.12em] text-paper shadow-paper active:scale-[0.98]"
        >
          SLIDE INTO {upperName}&apos;S DMS
        </button>
      </div>
    </BottomSheet>
  )
}
