import { useApp } from '../state/AppContext'
import { animals } from '../data/animals'
import { passesFilters } from '../lib/filters'
import { BottomSheet } from '../components/BottomSheet'
import type { Species } from '../types'

const speciesChips: { label: string; value: 'all' | Species }[] = [
  { label: 'ALL FLOOFS', value: 'all' },
  { label: 'DOGS', value: 'dog' },
  { label: 'CATS', value: 'cat' },
]

export function FiltersSheet() {
  const { state, dispatch } = useApp()
  const { filters } = state

  const filteredCount = animals.filter((a) => passesFilters(a, filters)).length
  const countLabel = `${filteredCount} FLOOF${filteredCount === 1 ? '' : 'S'}`

  return (
    <BottomSheet open={state.showFilters} onClose={() => dispatch({ type: 'CLOSE_FILTERS' })}>
      <div className="px-5 pb-6 pt-1">
        <div className="mb-4 font-display text-[22px]">Narrow the field</div>

        <div className="mb-2 font-mono text-[9.5px] tracking-[0.2em] text-ink/55">SPECIES</div>
        <div className="mb-5 flex gap-2">
          {speciesChips.map((chip) => {
            const active = filters.species === chip.value
            return (
              <button
                key={chip.value}
                onClick={() => dispatch({ type: 'SET_FILTER', patch: { species: chip.value } })}
                className={`rounded-full px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.1em] active:scale-95 ${
                  active
                    ? 'border-[1.5px] border-ink bg-ink text-paper'
                    : 'border-[1.5px] border-dashed border-ink bg-card text-ink'
                }`}
              >
                {chip.label}
              </button>
            )
          })}
        </div>

        <div className="mb-1 flex justify-between font-mono text-[9.5px] tracking-[0.16em] text-ink/70">
          <span>DISTANCE</span>
          <span className="text-rust">≤ {filters.maxDist} KM</span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={filters.maxDist}
          onChange={(e) => dispatch({ type: 'SET_FILTER', patch: { maxDist: +e.target.value } })}
          className="mb-[18px] w-full accent-rust"
        />

        <div className="mb-1 flex justify-between font-mono text-[9.5px] tracking-[0.16em] text-ink/70">
          <span>AGE</span>
          <span className="text-rust">≤ {filters.maxAge} YRS</span>
        </div>
        <input
          type="range"
          min="1"
          max="15"
          value={filters.maxAge}
          onChange={(e) => dispatch({ type: 'SET_FILTER', patch: { maxAge: +e.target.value } })}
          className="mb-[22px] w-full accent-rust"
        />

        <button
          onClick={() => dispatch({ type: 'CLOSE_FILTERS' })}
          className="w-full rounded-full bg-ink py-[14px] font-mono text-xs font-semibold tracking-[0.12em] text-paper active:scale-[0.98]"
        >
          SHOW ME {countLabel}
        </button>
      </div>
    </BottomSheet>
  )
}
