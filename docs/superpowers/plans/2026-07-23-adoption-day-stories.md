# Adoption-Day Stories Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Discover story-ring row into an adoption-agency showcase — each circle shows a mock agency monogram, and tapping it opens a tap-through deck of adoption-day ads (past recaps + upcoming promos).

**Architecture:** Each agency's story becomes a variable-length deck of `AdoptionEvent` slides, each carrying its own `kind` (`upcoming` | `recap`). A new `AgencyEmblem` component renders the circle monogram. `StoryViewer` renders a dynamic progress bar plus one of two slide layouts (flyer / recap) chosen by `kind`. The advance logic (`nextStory`) is generalized to decks of any length.

**Tech Stack:** React + TypeScript, Vite, Tailwind CSS v4 (`@theme` tokens in `src/index.css`), Vitest + Testing Library, oxlint.

## Global Constraints

- **No new image assets.** Event backdrops reuse existing pet photos via the pet `id` (`AnimalPhoto id={...}`). Valid pet ids: `haku`, `moon-cake`, `yuki`, `miso`, `pretzel`, `juniper`, `meatball`, `pickle`.
- **Mock only.** The RSVP button is visual — it must not navigate or advance the story.
- **Palette:** use existing theme tokens only. Agency tints map to `rust`, `sage`, `amber` (the three accent colors in `src/index.css`). Do **not** invent `sky`/`moss` tokens (the spec's placeholder names).
- **Voice:** flyer/recap copy is in the app's playful zine tone.
- **Test command:** `npm test` runs the whole suite; `npx vitest run <path>` runs one file. Commit after each task.
- **Fonts:** `font-display` (Young Serif), `font-mono` (IBM Plex Mono), `font-body` (Karla).

---

## File Structure

- `src/components/AgencyEmblem.tsx` (new) — circle monogram badge; owns and exports the `AgencyTint` union + tint→class map.
- `src/components/AgencyEmblem.test.tsx` (new).
- `src/types.ts` (modify) — add `AdoptionEventKind`, `AdoptionEvent`; rewrite `ShelterStory` (add `mono`, `tint`, `events`; remove `when`, `note`).
- `src/data/stories.ts` (modify) — rewrite with the three agencies' decks.
- `src/lib/story.ts` (modify) — generalize `nextStory` to variable deck length.
- `src/lib/story.test.ts` (modify).
- `src/state/reducer.ts` (modify) — pass current agency's slide count to `nextStory`.
- `src/state/reducer.test.ts` (modify) — deck-based `ADVANCE_STORY` walk.
- `src/overlays/StoryViewer.tsx` (modify) — dynamic bar + two slide layouts.
- `src/overlays/StoryViewer.test.tsx` (modify).
- `src/screens/Discover.tsx` (modify) — use `AgencyEmblem` in the ring.
- `src/screens/Discover.test.tsx` (modify) — assert monogram renders.
- `src/assets/pets/index.ts` (modify, Task 6) — remove now-unused `storyPhoto` + `story-*.jpg` imports.

---

### Task 1: `AgencyEmblem` component

Standalone. Owns the `AgencyTint` union so later tasks (and `types.ts`) import it from here.

**Files:**
- Create: `src/components/AgencyEmblem.tsx`
- Test: `src/components/AgencyEmblem.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `export type AgencyTint = 'rust' | 'sage' | 'amber'`
  - `export function AgencyEmblem(props: { mono: string; tint: AgencyTint; className?: string }): JSX.Element`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/AgencyEmblem.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AgencyEmblem } from './AgencyEmblem'

describe('AgencyEmblem', () => {
  it('renders the monogram', () => {
    render(<AgencyEmblem mono="HT" tint="rust" />)
    expect(screen.getByText('HT')).toBeInTheDocument()
  })

  it('applies the tint colour class', () => {
    render(<AgencyEmblem mono="WH" tint="sage" />)
    expect(screen.getByText('WH').className).toContain('bg-sage')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/AgencyEmblem.test.tsx`
Expected: FAIL — cannot resolve `./AgencyEmblem`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/AgencyEmblem.tsx
export type AgencyTint = 'rust' | 'sage' | 'amber'

const TINTS: Record<AgencyTint, string> = {
  rust: 'bg-rust text-paper',
  sage: 'bg-sage text-paper',
  amber: 'bg-amber text-paper',
}

interface Props {
  mono: string
  tint: AgencyTint
  className?: string
}

export function AgencyEmblem({ mono, tint, className = '' }: Props) {
  return (
    <span
      className={`flex h-full w-full items-center justify-center rounded-full border-[1.5px] border-ink font-display text-[15px] leading-none tracking-tight ${TINTS[tint]} ${className}`}
    >
      {mono}
    </span>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/AgencyEmblem.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/AgencyEmblem.tsx src/components/AgencyEmblem.test.tsx
git commit -m "feat: add AgencyEmblem monogram component"
```

---

### Task 2: Story data model + mock decks

Redefine the story types and rewrite the mock data. This removes `when`/`note`, so `StoryViewer.tsx` (Task 4) and its test are temporarily inconsistent — Tasks 3–4 restore green. **Run only the targeted test files in this task**, not the whole suite.

**Files:**
- Modify: `src/types.ts` (imports; `ShelterStory` at lines ~22-27; add new types after it)
- Modify: `src/data/stories.ts` (full rewrite)

**Interfaces:**
- Consumes: `AgencyTint` from `src/components/AgencyEmblem` (Task 1).
- Produces:
  - `export type AdoptionEventKind = 'upcoming' | 'recap'`
  - `export interface AdoptionEvent { kind: AdoptionEventKind; photoId?: string; title?: string; day?: string; time?: string; place?: string; pitch?: string; stat?: string; crowd?: string; thanks?: string }`
  - `export interface ShelterStory { id: string; shelter: string; short: string; mono: string; tint: AgencyTint; events: AdoptionEvent[] }`
  - `shelterStories: ShelterStory[]` — 3 agencies; deck sizes 4, 3, 3. Agency index 2 (`Paws & Effect`) has exactly 3 slides (relied on by the reducer test in Task 5).

- [ ] **Step 1: Write the failing test**

```tsx
// append to src/data/stories.ts's sibling — create src/data/stories.test.ts
import { describe, it, expect } from 'vitest'
import { shelterStories } from './stories'

describe('shelterStories', () => {
  it('has three agencies each with a monogram, tint and a non-empty deck', () => {
    expect(shelterStories).toHaveLength(3)
    for (const s of shelterStories) {
      expect(s.mono).toMatch(/^[A-Z]{2}$/)
      expect(['rust', 'sage', 'amber']).toContain(s.tint)
      expect(s.events.length).toBeGreaterThan(0)
      for (const e of s.events) {
        expect(['upcoming', 'recap']).toContain(e.kind)
      }
    }
  })

  it('mixes upcoming and recap kinds and varies deck length', () => {
    const lengths = shelterStories.map((s) => s.events.length)
    expect(new Set(lengths).size).toBeGreaterThan(1) // not all the same
    const kinds = shelterStories.flatMap((s) => s.events.map((e) => e.kind))
    expect(kinds).toContain('upcoming')
    expect(kinds).toContain('recap')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/stories.test.ts`
Expected: FAIL — current data has no `mono`/`tint`/`events`.

- [ ] **Step 3a: Update `src/types.ts`**

Add this import at the top of `src/types.ts`:

```ts
import type { AgencyTint } from './components/AgencyEmblem'
```

Replace the existing `ShelterStory` interface (currently `id`, `shelter`, `short`, `when`, `note`) with:

```ts
export type AdoptionEventKind = 'upcoming' | 'recap'

export interface AdoptionEvent {
  kind: AdoptionEventKind
  photoId?: string // reuse an existing pet id as the backdrop
  title?: string
  // upcoming (flyer):
  day?: string
  time?: string
  place?: string
  pitch?: string
  // recap:
  stat?: string
  crowd?: string
  thanks?: string
}

export interface ShelterStory {
  id: string
  shelter: string
  short: string
  mono: string
  tint: AgencyTint
  events: AdoptionEvent[]
}
```

- [ ] **Step 3b: Rewrite `src/data/stories.ts`**

```ts
import type { ShelterStory } from '../types'

export const shelterStories: ShelterStory[] = [
  {
    id: 's1',
    shelter: 'Happy Tails Rescue',
    short: 'Happy Tails',
    mono: 'HT',
    tint: 'rust',
    events: [
      {
        kind: 'upcoming',
        photoId: 'haku',
        title: 'ADOPTION DAY',
        day: 'SAT · SEP 14',
        time: '10AM – 2PM',
        place: 'Dolores Park, SF',
        pitch: 'Eight pups + one very good boy named Haku, all looking for humans.',
      },
      {
        kind: 'recap',
        photoId: 'pretzel',
        stat: '14 ADOPTED',
        crowd: '160 friends showed up',
        thanks: 'thank you, San Francisco 🧡',
      },
      {
        kind: 'upcoming',
        photoId: 'haku',
        title: 'PUPPY MEET & GREET',
        day: 'THU · SEP 19',
        time: '4 – 7PM',
        place: 'The Yard, Oakland',
        pitch: 'Six wrinkly newcomers make their public debut. Bring tissues.',
      },
      {
        kind: 'recap',
        photoId: 'pretzel',
        title: 'SUMMER FAIR',
        stat: '31 TAILS REHOMED',
        crowd: 'our biggest turnout yet',
        thanks: 'you people are the best',
      },
    ],
  },
  {
    id: 's2',
    shelter: 'Whisker Haven',
    short: 'Whisker Haven',
    mono: 'WH',
    tint: 'sage',
    events: [
      {
        kind: 'upcoming',
        photoId: 'moon-cake',
        title: 'KITTEN OPEN HOUSE',
        day: 'SUN · SEP 15',
        time: '11AM – 3PM',
        place: 'Whisker Haven, Berkeley',
        pitch: "It's officially kitten season. Come get purred at.",
      },
      {
        kind: 'recap',
        photoId: 'pickle',
        stat: '9 CATS',
        crowd: 'found their humans',
        thanks: 'not a dry eye in the room',
      },
      {
        kind: 'recap',
        photoId: 'miso',
        title: 'CATURDAY',
        stat: '5 SENIORS ADOPTED',
        crowd: 'the grey-muzzle crew wins again',
        thanks: 'love wins',
      },
    ],
  },
  {
    id: 's3',
    shelter: 'Paws & Effect',
    short: 'Paws & Effect',
    mono: 'PE',
    tint: 'amber',
    events: [
      {
        kind: 'upcoming',
        photoId: 'yuki',
        title: 'FEE-WAIVED FAIR',
        day: 'SAT · SEP 14',
        time: '9AM – 1PM',
        place: 'Civic Center Plaza',
        pitch: 'First ten adoptions, fees on us.',
      },
      {
        kind: 'upcoming',
        photoId: 'juniper',
        title: 'MOBILE VAN STOP',
        day: 'WED · SEP 18',
        time: 'NOON – 3PM',
        place: 'Mission & 24th',
        pitch: 'The adoption van rolls up with a full crew of hopefuls.',
      },
      {
        kind: 'recap',
        photoId: 'meatball',
        stat: '23 ADOPTED',
        crowd: 'in a single day',
        thanks: 'record broken, hearts full',
      },
    ],
  },
]
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/data/stories.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/types.ts src/data/stories.ts src/data/stories.test.ts
git commit -m "feat: model adoption-day decks as story data"
```

---

### Task 3: Variable-length `nextStory`

Generalize the advance function so decks of any length advance and roll over.

**Files:**
- Modify: `src/lib/story.ts`
- Modify: `src/lib/story.test.ts`

**Interfaces:**
- Consumes: `StoryPos` (`{ idx: number; pic: number }`, unchanged).
- Produces: `export function nextStory(pos: StoryPos, picCount: number, storyCount: number): StoryPos | null` — advances `pic` within the current deck (`picCount` slides), else rolls to the next agency (`storyCount` agencies), else `null`.

- [ ] **Step 1: Write the failing test** (replace the body of `src/lib/story.test.ts`)

```ts
import { describe, it, expect } from 'vitest'
import { nextStory } from './story'

describe('nextStory', () => {
  it('advances the slide within a deck', () => {
    expect(nextStory({ idx: 0, pic: 0 }, 4, 3)).toEqual({ idx: 0, pic: 1 })
  })
  it('rolls to the next agency after the last slide of a deck', () => {
    expect(nextStory({ idx: 0, pic: 3 }, 4, 3)).toEqual({ idx: 1, pic: 0 })
  })
  it('handles a shorter deck', () => {
    expect(nextStory({ idx: 1, pic: 2 }, 3, 3)).toEqual({ idx: 2, pic: 0 })
  })
  it('closes after the last slide of the last agency', () => {
    expect(nextStory({ idx: 2, pic: 2 }, 3, 3)).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/story.test.ts`
Expected: FAIL — `nextStory` still hard-codes `pic < 2` and ignores `picCount`.

- [ ] **Step 3: Update `src/lib/story.ts`**

```ts
import type { StoryPos } from '../types'

/** Advance within a deck of `picCount` slides, then roll to the next of
 *  `storyCount` agencies; returns null when the whole run is over. */
export function nextStory(pos: StoryPos, picCount: number, storyCount: number): StoryPos | null {
  if (pos.pic < picCount - 1) return { idx: pos.idx, pic: pos.pic + 1 }
  if (pos.idx + 1 < storyCount) return { idx: pos.idx + 1, pic: 0 }
  return null
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/story.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/story.ts src/lib/story.test.ts
git commit -m "feat: generalize nextStory to variable-length decks"
```

---

### Task 4: `StoryViewer` — dynamic bar + flyer/recap layouts

Rewrite the overlay to render one progress segment per slide and pick a layout by `kind`. Restores the suite to green.

**Files:**
- Modify: `src/overlays/StoryViewer.tsx` (full rewrite of the component body)
- Modify: `src/overlays/StoryViewer.test.tsx`

**Interfaces:**
- Consumes: `shelterStories` (Task 2), `AnimalPhoto` (existing, resolves `id` → pet photo).
- Produces: no new exports (same `StoryViewer` component).

- [ ] **Step 1: Write the failing tests** (replace the body of `src/overlays/StoryViewer.test.tsx`)

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { StoryViewer } from './StoryViewer'

// Opens agency 0 and advances `steps` slides before rendering assertions run.
function Open({ steps = 0 }: { steps?: number }) {
  const { state, dispatch } = useApp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch({ type: 'OPEN_STORY', idx: 0 })
    for (let i = 0; i < steps; i++) dispatch({ type: 'ADVANCE_STORY' })
  }, [])
  return (
    <>
      <StoryViewer />
      <output>story:{state.story ? `${state.story.idx}-${state.story.pic}` : 'none'}</output>
    </>
  )
}

describe('StoryViewer', () => {
  it('renders one progress segment per slide in the deck', () => {
    render(<AppProvider><Open /></AppProvider>)
    // Happy Tails has 4 slides.
    expect(screen.getByTestId('story-bars').children).toHaveLength(4)
  })

  it('shows the upcoming flyer for an upcoming slide', () => {
    render(<AppProvider><Open /></AppProvider>)
    expect(screen.getByText(/UPCOMING/)).toBeInTheDocument()
    expect(screen.getByText('SAT · SEP 14')).toBeInTheDocument()
    expect(screen.getByText('RSVP →')).toBeInTheDocument()
  })

  it('shows the recap for a recap slide', () => {
    render(<AppProvider><Open steps={1} /></AppProvider>)
    expect(screen.getByText(/RECAP/)).toBeInTheDocument()
    expect(screen.getByText('14 ADOPTED')).toBeInTheDocument()
  })

  it('RSVP button does not advance the story', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByText('RSVP →'))
    expect(screen.getByText('story:0-0')).toBeInTheDocument()
  })

  it('close ✕ dismisses the story', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByLabelText('Close story'))
    expect(screen.getByText('story:none')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/overlays/StoryViewer.test.tsx`
Expected: FAIL — no `story-bars` testid, no flyer/recap markup.

- [ ] **Step 3: Rewrite `src/overlays/StoryViewer.tsx`**

```tsx
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/overlays/StoryViewer.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/overlays/StoryViewer.tsx src/overlays/StoryViewer.test.tsx
git commit -m "feat: render adoption-day flyer and recap layouts"
```

---

### Task 5: Reducer passes the deck's slide count

`ADVANCE_STORY` must give `nextStory` the current agency's `events.length`.

**Files:**
- Modify: `src/state/reducer.ts` (the `ADVANCE_STORY` case, ~lines 95-98)
- Modify: `src/state/reducer.test.ts` (the `ADVANCE_STORY` test, ~lines 62-69)

**Interfaces:**
- Consumes: `nextStory(pos, picCount, storyCount)` (Task 3); `shelterStories` (Task 2).
- Produces: no new exports.

- [ ] **Step 1: Update the failing test** (replace the existing `ADVANCE_STORY` test in `src/state/reducer.test.ts`)

```ts
it('ADVANCE_STORY walks a deck then closes', () => {
  // Agency index 2 (Paws & Effect) has exactly 3 slides.
  let s = reducer(initialState, { type: 'OPEN_STORY', idx: 2 })
  expect(s.story).toEqual({ idx: 2, pic: 0 })
  s = reducer(s, { type: 'ADVANCE_STORY' })
  expect(s.story).toEqual({ idx: 2, pic: 1 })
  s = reducer(s, { type: 'ADVANCE_STORY' })
  expect(s.story).toEqual({ idx: 2, pic: 2 })
  s = reducer(s, { type: 'ADVANCE_STORY' }) // past last slide → close
  expect(s.story).toBeNull()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/state/reducer.test.ts`
Expected: FAIL — reducer still calls `nextStory(state.story, shelterStories.length)` (2 args), so `picCount` = 3 (agency count) and `storyCount` is `undefined`; the deck walk gives wrong positions.

- [ ] **Step 3: Update `src/state/reducer.ts`**

Replace the `ADVANCE_STORY` case with:

```ts
    case 'ADVANCE_STORY': {
      if (!state.story) return state
      const deck = shelterStories[state.story.idx].events.length
      return { ...state, story: nextStory(state.story, deck, shelterStories.length) }
    }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/state/reducer.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/state/reducer.ts src/state/reducer.test.ts
git commit -m "feat: advance stories by the deck's slide count"
```

---

### Task 6: Discover ring uses `AgencyEmblem`

Swap the empty-photo placeholder for the monogram badge.

**Files:**
- Modify: `src/screens/Discover.tsx` (import + ring markup, ~lines 42-48)
- Modify: `src/screens/Discover.test.tsx` (add a monogram assertion)

**Interfaces:**
- Consumes: `AgencyEmblem` (Task 1), `shelterStories` with `mono`/`tint` (Task 2).

- [ ] **Step 1: Write the failing test** (add inside the existing `describe` in `src/screens/Discover.test.tsx`)

```tsx
it('shows agency monograms in the story ring', () => {
  render(<AppProvider><Discover /></AppProvider>)
  expect(screen.getByText('HT')).toBeInTheDocument()
  expect(screen.getByText('WH')).toBeInTheDocument()
  expect(screen.getByText('PE')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/screens/Discover.test.tsx`
Expected: FAIL — the ring renders `AnimalPhoto` (shelter initial), not the `HT`/`WH`/`PE` monograms.

- [ ] **Step 3: Update `src/screens/Discover.tsx`**

Add the import near the other component imports:

```tsx
import { AgencyEmblem } from '../components/AgencyEmblem'
```

Replace the `AnimalPhoto` inside the ring `<span>` (currently `<AnimalPhoto src={undefined} id={undefined} name={s.short} shape="circle" />`) with:

```tsx
              <AgencyEmblem mono={s.mono} tint={s.tint} />
```

Then, if `AnimalPhoto` is no longer referenced anywhere else in `Discover.tsx`, remove its now-unused import (oxlint will flag it otherwise).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/screens/Discover.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/screens/Discover.tsx src/screens/Discover.test.tsx
git commit -m "feat: show agency monograms in the Discover story ring"
```

---

### Task 7: Remove unused story photo assets

With backdrops now resolving through `AnimalPhoto id`, `storyPhoto` and the three `story-*.jpg` imports are dead.

**Files:**
- Modify: `src/assets/pets/index.ts`
- Delete: `src/assets/pets/story-0.jpg`, `story-1.jpg`, `story-2.jpg`

- [ ] **Step 1: Confirm nothing references them**

Run: `grep -rn "storyPhoto\|story-0\|story-1\|story-2\|story0\|story1\|story2" src`
Expected: matches ONLY inside `src/assets/pets/index.ts`. If anything else matches, stop and reconcile before deleting.

- [ ] **Step 2: Edit `src/assets/pets/index.ts`**

Remove the three imports at the top:

```ts
import story0 from './story-0.jpg'
import story1 from './story-1.jpg'
import story2 from './story-2.jpg'
```

Remove the `storyPhotos` array (`const storyPhotos = [story0, story1, story2]`) and the entire `storyPhoto` function:

```ts
export function storyPhoto(idx: number): string | undefined {
  return storyPhotos[idx]
}
```

Leave `petPhoto`, `petPhotoCount`, and the glob loader untouched.

- [ ] **Step 3: Delete the image files**

```bash
git rm src/assets/pets/story-0.jpg src/assets/pets/story-1.jpg src/assets/pets/story-2.jpg
```

- [ ] **Step 4: Run the full suite + lint + build**

```bash
npm test && npm run lint && npm run build
```
Expected: all tests PASS, lint clean, build succeeds (no unresolved `story-*.jpg` import).

- [ ] **Step 5: Commit**

```bash
git add src/assets/pets/index.ts
git commit -m "chore: drop unused story photo assets"
```

---

## Self-Review

**Spec coverage:**
- Monogram logo in circle → Tasks 1, 6. ✅
- Uniform ring treatment (no past/future distinction) → Task 6 keeps the existing dashed ring; emblem carries only tint. ✅
- Variable-length, freely-mixed decks → Tasks 2, 3, 5. ✅
- Flyer (upcoming) + recap layouts → Task 4. ✅
- Mock RSVP is non-functional → Task 4 (`stopPropagation`, no dispatch) + test. ✅
- Reuse pet photos, no new assets → Task 2 `photoId`, Task 4 `AnimalPhoto id`, Task 7 removes old assets. ✅
- Tests for emblem, flyer/recap, dynamic progress, `nextStory`, reducer → Tasks 1-6. ✅

**Deviations from spec (intentional):**
- Tint tokens are `rust`/`sage`/`amber` (real theme colors), not the spec's placeholder `sky`/`moss` — noted in Global Constraints.
- `AgencyTint` lives in `AgencyEmblem.tsx` (a UI concern) and is imported by `types.ts`, rather than defined in `types.ts` — avoids ordering/duplication.

**Type consistency:** `nextStory(pos, picCount, storyCount)` defined in Task 3 is called with that exact 3-arg shape in Task 5. `ShelterStory.events`/`mono`/`tint` defined in Task 2 are consumed in Tasks 4 (`events`) and 6 (`mono`, `tint`). `AgencyTint` produced in Task 1, consumed in Task 2. `AdoptionEvent` optional fields match the flyer/recap reads in Task 4.

**Placeholder scan:** none — all steps carry concrete code/commands.

**Note on green-suite ordering:** Task 2 intentionally leaves `StoryViewer.tsx` inconsistent with the new data (it still reads `.when`/`.note`); Task 4 fixes it. Between Tasks 2-3 run only the targeted test files (as each task states); the full suite is green again after Task 4 and verified end-to-end in Task 7.
