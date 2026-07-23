import type { Animal } from '../types'
import { AnimalPhoto } from './AnimalPhoto'
import { Chip } from './Chip'
import { Stamp } from './Stamp'
import { useSwipe } from '../hooks/useSwipe'
import { tiltDeg } from './tilt'
import type { SwipeDir } from '../types'

interface Props {
  animal: Animal
  score: number
  position: number // 0 top, 1, 2, -1 hidden
  onCommit: (dir: SwipeDir) => void
  onOpenDetail: () => void
}

const posTransform = (p: number): string => {
  if (p === 0) return tiltDeg(-1.2)
  if (p === 1) return `translateY(14px) scale(.96) ${tiltDeg(1.6)}`
  if (p === 2) return `translateY(26px) scale(.92) ${tiltDeg(-2)}`
  return 'translateY(26px) scale(.92)'
}

export function SwipeCard({ animal, score, position, onCommit, onOpenDetail }: Props) {
  const isTop = position === 0
  const { ref, handlers, wasDragged } = useSwipe({ enabled: isTop, onCommit })
  if (position < 0) return null

  const zClass = position === 0 ? 'z-30' : position === 1 ? 'z-20' : 'z-10'

  return (
    <div
      ref={ref}
      {...(isTop ? handlers : {})}
      onClick={() => { if (isTop && !wasDragged()) onOpenDetail() }}
      style={{ transform: posTransform(position), touchAction: 'none' }}
      className={`absolute inset-0 ${zClass} ${isTop ? 'cursor-grab' : ''} select-none transition-transform`}
    >
      <div className="flex h-full flex-col rounded-[18px] border-[1.5px] border-ink bg-card p-2.5 pb-3 shadow-paperlg">
        <div className="relative min-h-0 flex-1">
          <AnimalPhoto id={animal.id} name={animal.name} shape="rounded" radius={10} />
          <div className="pointer-events-none absolute right-2.5 top-3 flex h-[62px] w-[62px] flex-col items-center justify-center rounded-full border-2 border-dashed border-rust bg-paper rotate-[8deg]">
            <span className="font-display text-[17px] text-rust">{score}</span>
            <span className="font-mono text-[6.5px] tracking-[0.14em] text-rust">% MATCH</span>
          </div>
          <Stamp kind="like" style={{ opacity: 0 }} />
          <Stamp kind="nope" style={{ opacity: 0 }} />
        </div>
        <div className="px-1.5 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[25px]">{animal.name}</span>
            <span className="font-mono text-xs text-ink/60">{animal.age} {animal.age === 1 ? 'yr' : 'yrs'}</span>
            <Chip variant="solid" className="ml-auto font-mono text-[9.5px] tracking-[0.1em]" style={{ transform: tiltDeg(-2) }}>
              {animal.dist} KM
            </Chip>
          </div>
          <div className="mt-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-rust">
            {animal.breed.toUpperCase()}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {animal.tags.map((t) => (
              <span key={t} className="rounded-full border-[1.5px] border-dashed border-ink bg-paper px-2.5 py-1.5 text-[11px] leading-none">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
