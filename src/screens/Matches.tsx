import { useApp } from '../state/AppContext'
import { AnimalPhoto } from '../components/AnimalPhoto'
import { Heart } from '../components/Heart'
import { tiltDeg } from '../components/tilt'
import { selectLiked, selectMutuals, selectShortlist } from '../state/selectors'

export function Matches() {
  const { state, dispatch } = useApp()
  const liked = selectLiked(state)
  const mutuals = selectMutuals(state)
  const shortlist = selectShortlist(state)

  const hasMutuals = mutuals.length > 0
  const hasShortlist = shortlist.length > 0
  const noMatches = liked.length === 0

  const likedCountLabel = `${liked.length} FLOOF${liked.length === 1 ? '' : 'S'} FAVED`
  const shortlistLabel = hasMutuals ? 'ALSO FAVED' : 'FAVED, AWAITING SPARKS'

  const openDetail = (id: string) => dispatch({ type: 'OPEN_DETAIL', id })
  const openChat = (id: string) => dispatch({ type: 'OPEN_CHAT', id })

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-[18px] animate-fade-in">
      <div className="-rotate-[1deg] font-display text-[28px]">The shortlist</div>
      <div className="mb-[18px] mt-1 font-mono text-[9.5px] tracking-[0.2em] text-ink/55">{likedCountLabel}</div>

      {hasMutuals && (
        <>
          <div className="mb-2.5 font-mono text-[9.5px] font-semibold tracking-[0.2em] text-sage">MUTUAL SPARKS <Heart /></div>
          <div className="-mx-5 mb-[18px] flex gap-3 overflow-x-auto px-5 pb-2 pt-1">
            {mutuals.map((m, i) => (
              <div
                key={m.id}
                style={{ transform: tiltDeg(i % 2 === 0 ? -1.5 : 1.5) }}
                className="w-[132px] flex-none rounded-[14px] border-[1.5px] border-ink bg-card p-2 shadow-paper"
              >
                <div className="relative h-[104px]">
                  <AnimalPhoto id={m.id} name={m.name} shape="rounded" radius={9} />
                  <span className="absolute left-1.5 top-1.5 -rotate-3 rounded-full bg-sage px-[7px] py-[3px] font-mono text-[7.5px] tracking-[0.1em] text-paper">
                    MUTUAL <Heart />
                  </span>
                </div>
                <button type="button" onClick={() => openDetail(m.id)} className="mt-[7px] block w-full cursor-pointer text-left">
                  <div className="font-display text-base">{m.name}</div>
                  <div className="font-mono text-[8.5px] tracking-[0.1em] text-ink/55">{m.breed.toUpperCase()}</div>
                </button>
                <button
                  type="button"
                  onClick={() => openChat(m.id)}
                  className="mt-[9px] w-full rounded-full border-[1.5px] border-ink bg-rust py-2 font-mono text-[9.5px] font-semibold tracking-[0.1em] text-paper shadow-paper active:scale-95"
                >
                  CHAT
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {hasShortlist && (
        <>
          <div className="mb-2.5 font-mono text-[9.5px] tracking-[0.2em] text-ink/55">{shortlistLabel}</div>
          <div className="flex flex-col gap-2.5">
            {shortlist.map((m, i) => (
              <div
                key={m.id}
                style={{ transform: tiltDeg(i % 2 === 0 ? -0.6 : 0.6) }}
                className="flex items-center gap-3 rounded-[14px] border-[1.5px] border-ink bg-card p-2 shadow-paper"
              >
                <button type="button" onClick={() => openDetail(m.id)} className="h-[52px] w-[52px] flex-none cursor-pointer rounded-full border-[1.5px] border-ink p-0.5">
                  <AnimalPhoto id={m.id} name={m.name} shape="circle" />
                </button>
                <button type="button" onClick={() => openDetail(m.id)} className="flex min-w-0 flex-1 cursor-pointer flex-col gap-0.5 text-left">
                  <span className="font-display text-[16.5px]">{m.name}</span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[8.5px] tracking-[0.1em] text-ink/55">
                    {m.breed.toUpperCase()} · {m.dist} KM
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => openChat(m.id)}
                  className="flex-none rounded-full border-none bg-ink px-3.5 py-2 font-mono text-[9px] font-semibold tracking-[0.1em] text-paper active:scale-95"
                >
                  CHAT
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {noMatches && (
        <div className="flex flex-col items-center gap-3 px-[26px] pt-[70px] text-center">
          <div className="-rotate-[8deg] font-display text-[34px] text-ink/30"><Heart />?</div>
          <div className="font-display text-xl">Nobody faved. Yet.</div>
          <div className="text-[13.5px] text-ink/60">Get back out there, cupid — the deck awaits.</div>
        </div>
      )}
    </div>
  )
}
