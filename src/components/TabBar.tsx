import { useApp } from '../state/AppContext'
import { selectLiked } from '../state/selectors'
import type { Screen } from '../types'

const TABS: { label: string; screen: Screen }[] = [
  { label: 'DISCOVER', screen: 'discover' },
  { label: 'MATCHES', screen: 'matches' },
  { label: 'PROFILE', screen: 'profile' },
]

export function TabBar() {
  const { state, dispatch } = useApp()
  const likedCount = selectLiked(state).length

  return (
    <div className="flex flex-none border-t-[1.5px] border-ink bg-[#fdf8ec]">
      {TABS.map((t) => {
        const active = state.screen === t.screen || (state.screen === 'chat' && t.screen === 'matches')
        const label = t.screen === 'matches' && likedCount ? `MATCHES · ${likedCount}` : t.label
        return (
          <button
            key={t.screen}
            onClick={() => dispatch({ type: 'NAVIGATE', screen: t.screen })}
            className={`flex-1 pb-[calc(env(safe-area-inset-bottom,0px)+22px)] pt-[22px] font-mono text-xs tracking-[0.18em] active:scale-95 ${active ? 'font-semibold text-rust' : 'text-ink/50'}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
