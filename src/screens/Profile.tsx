import type { ChangeEvent } from 'react'
import { useApp } from '../state/AppContext'
import { AnimalPhoto } from '../components/AnimalPhoto'
import { tiltDeg } from '../components/tilt'
import { fileToAvatarDataUrl, saveAvatar } from '../lib/avatar'
import { selectLiked, selectMutuals, selectPrefChips } from '../state/selectors'

export function Profile() {
  const { state, dispatch } = useApp()

  async function onPickAvatar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // let the same file be re-picked later
    if (!file) return
    try {
      const url = await fileToAvatarDataUrl(file)
      saveAvatar(url)
      dispatch({ type: 'SET_AVATAR', value: url })
    } catch {
      // unreadable / unsupported image — leave the current photo untouched
    }
  }

  const met = Object.keys(state.swiped).length
  const smitten = selectLiked(state).length
  const mutuals = selectMutuals(state).length
  const prefChips = selectPrefChips(state)
  const chips = prefChips.length > 0 ? prefChips : ['Quiz not taken (rebel)']

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-[22px] py-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <label
          style={{ transform: tiltDeg(-3) }}
          aria-label="Change your profile photo"
          className="relative block h-[88px] w-[88px] flex-none cursor-pointer rounded-full border-2 border-dashed border-rust p-1"
        >
          <AnimalPhoto name="You" src={state.avatar ?? undefined} shape="circle" />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-ink bg-paper text-[11px] shadow-paper">
            📷
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
        </label>
        <span className="flex flex-col gap-[3px]">
          <span className="font-display text-2xl">You</span>
          <span className="font-mono text-[9px] tracking-[0.16em] text-ink/55">CERTIFIED FUTURE PET PARENT</span>
        </span>
      </div>

      <div className="my-[22px] flex gap-2.5">
        <div
          style={{ transform: tiltDeg(-0.6) }}
          className="flex-1 rounded-xl border-[1.5px] border-ink bg-card px-2 py-3 text-center shadow-paper"
        >
          <div className="font-display text-[21px]">{met}</div>
          <div className="font-mono text-[8px] tracking-[0.16em] text-ink/55">MET</div>
        </div>
        <div
          style={{ transform: tiltDeg(0.8) }}
          className="flex-1 rounded-xl border-[1.5px] border-ink bg-card px-2 py-3 text-center shadow-paper"
        >
          <div className="font-display text-[21px] text-rust">{smitten}</div>
          <div className="font-mono text-[8px] tracking-[0.16em] text-ink/55">SMITTEN</div>
        </div>
        <div
          style={{ transform: tiltDeg(-0.8) }}
          className="flex-1 rounded-xl border-[1.5px] border-ink bg-card px-2 py-3 text-center shadow-paper"
        >
          <div className="font-display text-[21px] text-sage">{mutuals}</div>
          <div className="font-mono text-[8px] tracking-[0.16em] text-ink/55">MUTUALS</div>
        </div>
      </div>

      <div className="mb-2.5 font-mono text-[9.5px] tracking-[0.2em] text-ink/55">YOUR VIBE, ON RECORD</div>
      <div className="flex flex-wrap gap-2">
        {chips.map((pc) => (
          <span
            key={pc}
            style={{ transform: tiltDeg(-1) }}
            className="rounded-full border-[1.5px] border-ink bg-card px-[13px] py-[7px] text-[12.5px]"
          >
            {pc}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'RETAKE_QUIZ' })}
        className="mt-[22px] w-full rounded-full border-none bg-ink py-3.5 font-mono text-[11px] font-semibold tracking-[0.14em] text-paper active:scale-[0.98]"
      >
        RETAKE THE VIBE QUIZ
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: 'LOGOUT' })}
        className="mt-2.5 w-full rounded-full border-[1.5px] border-dashed border-rust bg-transparent py-[13px] font-mono text-[11px] font-semibold tracking-[0.14em] text-rust active:scale-[0.98]"
      >
        LOG OUT (THE FLOOFS WILL WAIT)
      </button>
      <p className="mt-4 text-center text-[11.5px] text-ink/45">
        Furever v0.9 — no animals were left un-booped in the making of this app.
      </p>
    </div>
  )
}
