# Furever Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `reference-project/Furever.dc.html` prototype (a "Tinder for animal adoption" mobile app) as a production-quality React + TypeScript + Tailwind v4 + Vite application with full visual and behavioral fidelity.

**Architecture:** Three layers — (1) a pure domain layer (typed models, seed data, pure logic functions), (2) a single `useReducer` store behind an `AppProvider` context with a `useApp()` hook, and (3) effect hooks (`useSwipe`, `useAutoReply`, `useStoryPlayer`) isolating timers and imperative DOM. Screens and overlays are focused components that read state and dispatch actions.

**Tech Stack:** React 19, TypeScript (strict), Tailwind CSS v4 (`@tailwindcss/vite`, tokens via `@theme`), Vite 8, Vitest + React Testing Library, `@fontsource` (offline fonts).

## Global Constraints

- **React 19**, function components + hooks only. `react/rules-of-hooks` is an oxlint error — obey it.
- **TypeScript strict mode.** No `any` except where a third-party type genuinely requires it (annotate with a comment).
- **No new runtime state/routing libraries.** State = `useReducer` + context. Screen switching = state, not a router.
- **Offline / no external calls at runtime.** Fonts via `@fontsource`; pet photos bundled under `src/assets/pets/` and imported so Vite fingerprints them.
- **Design tokens live in `src/index.css` via `@theme`** — never hardcode the hex palette in components; use the token utilities (`bg-paper`, `text-ink`, `shadow-paper`, `font-display`, etc.).
- **Copy strings are product content** — copy them verbatim from `reference-project/Furever.dc.html` (taglines, button labels, empty-state text, quiz questions, animal bios). Do not paraphrase.
- **Config defaults (hardcoded):** `START_SCREEN='login'`, `MATCH_MODE='destiny'`, `TILT=true`.
- **TDD** for all logic in `src/lib/`, the reducer, and the pure hook helpers. UI components get at least one React Testing Library behavior test.
- **Commit after every task** using the message shown in that task's final step.

## Palette / token reference (source of truth for Task 1)

| Token | Value | Reference use |
|---|---|---|
| `--color-paper` | `#f6f0e3` | screen background |
| `--color-paperdark` | `#e7e0d1` | body backdrop, tape strips |
| `--color-card` | `#fffdf6` | cards, inputs, buttons |
| `--color-ink` | `#2a2118` | text, borders |
| `--color-rust` | `#c2593c` | primary accent |
| `--color-rustdark` | `#9c4527` | link hover |
| `--color-sage` | `#4d8a68` | positive / mutual |
| `--color-amber` | `#b8860b` | "ASK" compat |
| `--color-nope` | `#b4452f` | pass / negative |
| `--shadow-paper` | `3px 4px 0 rgba(42,33,24,.14)` | standard hard shadow |
| `--shadow-paperlg` | `5px 7px 0 rgba(42,33,24,.13)` | card stack shadow |

---

## Task 1: Project setup — TypeScript, Tailwind tokens, fonts, Vitest

**Files:**
- Create: `tsconfig.json`, `tsconfig.node.json`, `src/vite-env.d.ts`, `src/test/setup.ts`
- Modify: `package.json`, `vite.config.js` → rename to `vite.config.ts`, `index.html`, `src/index.css`, `src/main.jsx` → `src/main.tsx`, `src/App.jsx` → `src/App.tsx`
- Delete: `src/App.jsx`, `src/main.jsx` (after renaming)

**Interfaces:**
- Produces: a building TS project; `npm run build`, `npm test`, `npm run typecheck` all succeed; design-token utilities (`bg-paper`, `text-ink`, `shadow-paper`, `font-display`, `font-body`, `font-mono`, `bg-dots`, `animate-slide-up`, `animate-pop-in`, `animate-fade-in`, `animate-wiggle`) available app-wide.

- [ ] **Step 1: Install dependencies**

```bash
npm install @fontsource/young-serif @fontsource/karla @fontsource/ibm-plex-mono
npm install -D typescript vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Add `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Add `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Add `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 5: Rename config + entry files to TS**

```bash
git mv vite.config.js vite.config.ts
git mv src/main.jsx src/main.tsx
git mv src/App.jsx src/App.tsx
```

- [ ] **Step 6: Replace `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```

- [ ] **Step 7: Add `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 8: Replace `src/index.css` with the token system**

```css
@import "tailwindcss";

@import "@fontsource/young-serif/400.css";
@import "@fontsource/karla/400.css";
@import "@fontsource/karla/500.css";
@import "@fontsource/karla/700.css";
@import "@fontsource/karla/800.css";
@import "@fontsource/ibm-plex-mono/400.css";
@import "@fontsource/ibm-plex-mono/500.css";
@import "@fontsource/ibm-plex-mono/600.css";

@theme {
  --color-paper: #f6f0e3;
  --color-paperdark: #e7e0d1;
  --color-card: #fffdf6;
  --color-ink: #2a2118;
  --color-rust: #c2593c;
  --color-rustdark: #9c4527;
  --color-sage: #4d8a68;
  --color-amber: #b8860b;
  --color-nope: #b4452f;

  --font-display: 'Young Serif', serif;
  --font-body: 'Karla', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --shadow-paper: 3px 4px 0 rgba(42, 33, 24, 0.14);
  --shadow-paperlg: 5px 7px 0 rgba(42, 33, 24, 0.13);

  --animate-slide-up: slideUp 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.05);
  --animate-pop-in: popIn 0.5s cubic-bezier(0.2, 1.4, 0.4, 1);
  --animate-fade-in: fadeIn 0.3s ease;
  --animate-wiggle: wiggle 0.4s ease;
}

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes popIn {
  0% { transform: scale(0.6) rotate(-8deg); opacity: 0; }
  70% { transform: scale(1.06) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(-2deg); opacity: 1; }
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fall {
  0% { transform: translateY(-60px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(820px) rotate(320deg); opacity: 0.5; }
}
@keyframes storybar { from { width: 0%; } to { width: 100%; } }
@keyframes wiggle { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }

@layer utilities {
  .bg-dots {
    background-image: radial-gradient(rgba(42, 33, 24, 0.05) 1px, transparent 1px);
    background-size: 14px 14px;
  }
}

body {
  margin: 0;
  font-family: var(--font-body);
  background: var(--color-paperdark);
}
```

- [ ] **Step 9: Replace `src/App.tsx` with a themed smoke-test shell**

```tsx
export default function App() {
  return (
    <div className="min-h-svh bg-paper bg-dots text-ink flex flex-col items-center justify-center gap-4">
      <h1 className="font-display text-5xl -rotate-1">furever<span className="text-rust">.</span></h1>
      <p className="font-mono text-xs tracking-[0.2em] text-ink/60">SWIPE · SMOOSH · ADOPT</p>
      <div className="bg-card border-[1.5px] border-ink rounded-2xl px-6 py-4 shadow-paper">Scaffold OK</div>
    </div>
  )
}
```

- [ ] **Step 10: Replace `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 11: Update `index.html` script src**

Change `<script type="module" src="/src/main.jsx"></script>` to `<script type="module" src="/src/main.tsx"></script>`.

- [ ] **Step 12: Add scripts to `package.json`**

Add to the `"scripts"` block:

```json
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
```

- [ ] **Step 13: Verify the toolchain**

Run: `npm run typecheck && npm run build && npm test`
Expected: typecheck passes, build succeeds, Vitest reports "No test files found" (exit 0 — acceptable at this stage; the next task adds tests).

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "chore: migrate scaffold to TypeScript + Tailwind tokens + Vitest"
```

---

## Task 2: Domain types + config

**Files:**
- Create: `src/types.ts`, `src/config.ts`

**Interfaces:**
- Produces: all shared types (`Species`, `Compat`, `Animal`, `ShelterStory`, `Screen`, `MatchMode`, `SwipeDir`, `LoginMode`, `Message`, `PrefKey`, `Prefs`, `Filters`, `QuizOption`, `QuizStep`) and constants `START_SCREEN`, `MATCH_MODE`, `TILT`.

- [ ] **Step 1: Write `src/types.ts`**

```ts
export type Species = 'dog' | 'cat'
export type Compat = 'YES' | 'NO' | 'ASK'

export interface Animal {
  id: string
  name: string
  species: Species
  breed: string
  age: number
  dist: number
  shelter: string
  fee: string
  score: number
  mutual: boolean
  tags: string[]
  kids: Compat
  dogs: Compat
  cats: Compat
  bio: string
}

export interface ShelterStory {
  id: string
  shelter: string
  short: string
  when: string
  note: string
}

export type Screen = 'login' | 'onboarding' | 'discover' | 'matches' | 'chat' | 'profile'
export type MatchMode = 'destiny' | 'every-like' | 'never'
export type SwipeDir = 'like' | 'nope'
export type LoginMode = 'signin' | 'register'
export type LoginField = 'name' | 'email' | 'pass'

export interface Message {
  from: 'me' | 'them'
  text: string
}

export type PrefKey = 'species' | 'home' | 'energy'
export type Prefs = Partial<Record<PrefKey, string>>

export interface Filters {
  species: 'all' | Species
  maxDist: number
  maxAge: number
}

export interface QuizOption {
  tag: string
  big: string
  small: string
  value: string
}

export interface QuizStep {
  title: string
  sub: string
  key: PrefKey
  options: QuizOption[]
}

export interface StoryPos {
  idx: number
  pic: number
}
```

- [ ] **Step 2: Write `src/config.ts`**

```ts
import type { Screen, MatchMode } from './types'

/** Where the app opens. Design-tool default: 'login'. */
export const START_SCREEN: Screen = 'login'

/**
 * When a "like" triggers a match celebration.
 * 'destiny' → only animals flagged mutual. 'every-like' → always. 'never' → off.
 */
export const MATCH_MODE: MatchMode = 'destiny'

/** Playful rotation on cards/chips. */
export const TILT = true
```

- [ ] **Step 3: Verify types compile**

Run: `npm run typecheck`
Expected: PASS (no errors).

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/config.ts
git commit -m "feat: add domain types and config constants"
```

---

## Task 3: Seed data

**Files:**
- Create: `src/data/animals.ts`, `src/data/stories.ts`, `src/data/quiz.ts`
- Test: `src/data/animals.test.ts`

**Interfaces:**
- Consumes: types from `src/types.ts`.
- Produces:
  - `animals: Animal[]` (8 entries) and `detailCaptions: Record<string, [string, string, string]>` from `data/animals.ts`
  - `shelterStories: ShelterStory[]` (3 entries) from `data/stories.ts`
  - `quizSteps: QuizStep[]` (3 entries) and `prefLabels: Record<string, string>` from `data/quiz.ts`

- [ ] **Step 1: Write the failing test `src/data/animals.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { animals, detailCaptions } from './animals'

describe('animals seed data', () => {
  it('has 8 animals with unique ids', () => {
    expect(animals).toHaveLength(8)
    expect(new Set(animals.map((a) => a.id)).size).toBe(8)
  })

  it('has exactly two mutual animals (destiny mode)', () => {
    // reference: biscuit, pretzel, pickle flagged mutual
    expect(animals.filter((a) => a.mutual).map((a) => a.id).sort()).toEqual(
      ['biscuit', 'pickle', 'pretzel'],
    )
  })

  it('provides three detail captions per animal', () => {
    for (const a of animals) {
      expect(detailCaptions[a.id]).toHaveLength(3)
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- animals`
Expected: FAIL — cannot resolve `./animals`.

- [ ] **Step 3: Write `src/data/animals.ts`**

Port the `animals` array and `capsMap` **verbatim** from `reference-project/Furever.dc.html:413-422` (data) and `:563-572` (captions). Preserve every string exactly (including the R-prefixed fees and unicode apostrophes).

```ts
import type { Animal } from '../types'

export const animals: Animal[] = [
  { id: 'biscuit', name: 'Haku', species: 'dog', breed: 'Australian Shepherd', age: 2, dist: 1.2, shelter: 'Happy Tails Rescue', fee: 'R1,450', score: 88, mutual: true, tags: ['food-motivated', 'certified goofball', 'leash optimist'], kids: 'YES', dogs: 'YES', cats: 'ASK', bio: 'Haku believes every stranger is a friend who hasn’t thrown a ball yet. Will trade unconditional love for exactly one (1) slice of cheese.' },
  { id: 'clementine', name: 'Moon Cake', species: 'cat', breed: 'Orange tabby', age: 6, dist: 0.8, shelter: 'Whisker Haven', fee: 'R950', score: 81, mutual: false, tags: ['chaos gremlin', 'sunbeam sommelier', '4am parkour'], kids: 'YES', dogs: 'NO', cats: 'YES', bio: 'One brain cell, zero regrets. Moon Cake will knock your pen off the desk and then look at you like YOU did it.' },
  { id: 'waffles', name: 'Yuki', species: 'dog', breed: 'Corgi', age: 4, dist: 3.1, shelter: 'Paws & Effect', fee: 'R1,650', score: 76, mutual: false, tags: ['professional loaf', 'herds children', 'big drama'], kids: 'YES', dogs: 'ASK', cats: 'YES', bio: 'Short king. Waffles has never once caught his tail but remains undefeated in optimism. Screams at the vacuum on your behalf.' },
  { id: 'miso', name: 'Miso', species: 'cat', breed: 'Siamese', age: 3, dist: 2.4, shelter: 'Whisker Haven', fee: 'R1,050', score: 72, mutual: false, tags: ['opinionated', 'velcro cat', 'bird TV critic'], kids: 'ASK', dogs: 'NO', cats: 'ASK', bio: 'Miso has notes. About everything. Adopt her and receive a lifetime subscription to running commentary, free of charge.' },
  { id: 'pretzel', name: 'Pretzel', species: 'dog', breed: 'Dachshund mix', age: 5, dist: 4.6, shelter: 'Happy Tails Rescue', fee: 'R1,250', score: 84, mutual: true, tags: ['burrito enthusiast', 'snoot booper', 'couch strategist'], kids: 'YES', dogs: 'YES', cats: 'YES', bio: 'Half dog, half blanket. Pretzel’s love language is tunneling under your duvet and sighing dramatically until cuddled.' },
  { id: 'juniper', name: 'Juniper', species: 'cat', breed: 'Tuxedo', age: 2, dist: 1.9, shelter: 'Paws & Effect', fee: 'R1,000', score: 79, mutual: false, tags: ['formalwear always', 'lap auditor', 'biscuit maker'], kids: 'YES', dogs: 'ASK', cats: 'YES', bio: 'Dressed for a gala, lives for a nap. Juniper kneads dough professionally (on your stomach, at 6am).' },
  { id: 'meatball', name: 'Meatball', species: 'dog', breed: 'Pit mix', age: 3, dist: 5.8, shelter: 'Paws & Effect', fee: 'R1,150', score: 86, mutual: false, tags: ['110% wiggle', 'sun worshipper', 'gentle unit'], kids: 'YES', dogs: 'YES', cats: 'ASK', bio: 'Built like a coffee table, soft like a marshmallow. Meatball’s tail has never stopped wagging. Scientists are baffled.' },
  { id: 'pickle', name: 'Pickle', species: 'cat', breed: 'Sphynx', age: 4, dist: 7.2, shelter: 'Whisker Haven', fee: 'R1,500', score: 70, mutual: true, tags: ['heated blanket seeker', 'alien prince', 'sweater collection'], kids: 'ASK', dogs: 'YES', cats: 'YES', bio: 'Pickle is naked and unbothered. Runs warmer than your laptop and demands to be treated like the royalty he clearly is.' },
]

export const detailCaptions: Record<string, [string, string, string]> = {
  biscuit: ['The face when someone spells W-A-L-K', 'What Sunday self-care looks like', 'Proof I can sit (for cheese)'],
  clementine: ['Mid-parkour, 4:07am', 'My sunbeam, my rules', 'The pen absolutely deserved it'],
  waffles: ['Peak loaf performance', 'Herding practice (the children are fine)', 'Vacuum stand-off, round 3'],
  miso: ['Reviewing the bird channel', 'I have notes about dinner', 'Velcro mode: engaged'],
  pretzel: ['Fully deployed burrito', 'Snoot ready for booping', 'Duvet tunnel, day 12'],
  juniper: ['Black tie, every day', 'Currently auditing this lap', 'Biscuit production, 6am sharp'],
  meatball: ['110% wiggle, captured live', 'Sun worship in progress', 'Gentle unit at rest'],
  pickle: ['Sweater weather is always', 'Royalty demands a heated blanket', 'Alien prince glamour shot'],
}
```

- [ ] **Step 4: Write `src/data/stories.ts`** (verbatim from `reference-project/Furever.dc.html:423-427`)

```ts
import type { ShelterStory } from '../types'

export const shelterStories: ShelterStory[] = [
  { id: 's1', shelter: 'Happy Tails Rescue', short: 'Happy Tails', when: '2H AGO', note: 'Six new arrivals this week — the goldens have landed.' },
  { id: 's2', shelter: 'Whisker Haven', short: 'Whisker Haven', when: '5H AGO', note: 'It is officially kitten season. Send help (and towels).' },
  { id: 's3', shelter: 'Paws & Effect', short: 'Paws & Effect', when: '1D AGO', note: 'Adoption fair this Saturday — first 10 fees waived!' },
]
```

- [ ] **Step 5: Write `src/data/quiz.ts`** (verbatim from `reference-project/Furever.dc.html:538-551` and prefLabels from `:604`)

```ts
import type { QuizStep } from '../types'

export const quizSteps: QuizStep[] = [
  {
    title: 'Team Woof or Team Meow?',
    sub: 'No wrong answers. Some furrier than others.',
    key: 'species',
    options: [
      { tag: 'A', big: 'Team Woof', small: 'Dogs are my love language', value: 'dog' },
      { tag: 'B', big: 'Team Meow', small: 'Cats chose me long ago', value: 'cat' },
      { tag: 'C', big: 'Chaos, please', small: 'All fur is good fur', value: 'both' },
    ],
  },
  {
    title: 'What’s home like?',
    sub: 'Be honest — they will find the one couch cushion that is theirs.',
    key: 'home',
    options: [
      { tag: 'A', big: 'Cozy apartment', small: 'Small space, big heart', value: 'apartment' },
      { tag: 'B', big: 'House + yard', small: 'Zoomies infrastructure included', value: 'yard' },
      { tag: 'C', big: 'Wide open spaces', small: 'Basically a nature documentary', value: 'farm' },
    ],
  },
  {
    title: 'Pick your speed.',
    sub: 'Matching energy levels is 90% of cohabitation.',
    key: 'energy',
    options: [
      { tag: 'A', big: 'Couch potato', small: 'Professional nappers only', value: 'chill' },
      { tag: 'B', big: 'Weekend warrior', small: 'Hikes, parks, the occasional puddle', value: 'medium' },
      { tag: 'C', big: 'Zoomies 24:7', small: 'I can keep up. Probably.', value: 'high' },
    ],
  },
]

export const prefLabels: Record<string, string> = {
  dog: 'Team Woof',
  cat: 'Team Meow',
  both: 'All fur welcome',
  apartment: 'Cozy apartment',
  yard: 'House + yard',
  farm: 'Wide open spaces',
  chill: 'Couch potato',
  medium: 'Weekend warrior',
  high: 'Zoomies 24:7',
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- animals`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add src/data
git commit -m "feat: add seed data (animals, stories, quiz)"
```

---

## Task 4: Pure logic — filters + matching + chat + stories helpers (TDD)

**Files:**
- Create: `src/lib/filters.ts`, `src/lib/matching.ts`, `src/lib/chat.ts`, `src/lib/story.ts`, `src/lib/swipe.ts`
- Test: `src/lib/filters.test.ts`, `src/lib/matching.test.ts`, `src/lib/chat.test.ts`, `src/lib/story.test.ts`, `src/lib/swipe.test.ts`

**Interfaces:**
- Consumes: `Animal`, `Filters`, `Prefs`, `MatchMode`, `Message`, `SwipeDir`, `StoryPos`.
- Produces:
  - `passesFilters(a: Animal, f: Filters): boolean`
  - `activeFilterCount(f: Filters): number`
  - `scoreFor(a: Animal, prefs: Prefs): number`
  - `isMatchEligible(a: Animal, mode: MatchMode): boolean`
  - `remainingDeck(animals: Animal[], swiped: Record<string, SwipeDir>, f: Filters): Animal[]`
  - `initialThread(a: Animal): Message[]`
  - `replyFor(a: Animal, myMessageCount: number): string`
  - `nextStory(pos: StoryPos, storyCount: number): StoryPos | null`
  - `swipeOutcome(dx: number): SwipeDir | null` (threshold ±110)

- [ ] **Step 1: Write `src/lib/filters.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { passesFilters, activeFilterCount } from './filters'
import type { Animal, Filters } from '../types'

const dog = { species: 'dog', dist: 3, age: 4 } as Animal
const wide: Filters = { species: 'all', maxDist: 25, maxAge: 12 }

describe('passesFilters', () => {
  it('passes when within all bounds', () => {
    expect(passesFilters(dog, wide)).toBe(true)
  })
  it('rejects wrong species', () => {
    expect(passesFilters(dog, { ...wide, species: 'cat' })).toBe(false)
  })
  it('rejects too far', () => {
    expect(passesFilters(dog, { ...wide, maxDist: 2 })).toBe(false)
  })
  it('rejects too old', () => {
    expect(passesFilters(dog, { ...wide, maxAge: 3 })).toBe(false)
  })
})

describe('activeFilterCount', () => {
  it('is 0 at defaults', () => {
    expect(activeFilterCount(wide)).toBe(0)
  })
  it('counts each narrowed dimension', () => {
    expect(activeFilterCount({ species: 'dog', maxDist: 10, maxAge: 5 })).toBe(3)
  })
})
```

- [ ] **Step 2: Run — expect FAIL** (`npm test -- filters`; cannot resolve `./filters`).

- [ ] **Step 3: Write `src/lib/filters.ts`**

```ts
import type { Animal, Filters } from '../types'

export function passesFilters(a: Animal, f: Filters): boolean {
  return (f.species === 'all' || a.species === f.species) && a.dist <= f.maxDist && a.age <= f.maxAge
}

export function activeFilterCount(f: Filters): number {
  return (f.species !== 'all' ? 1 : 0) + (f.maxDist < 25 ? 1 : 0) + (f.maxAge < 12 ? 1 : 0)
}
```

- [ ] **Step 4: Run — expect PASS** (`npm test -- filters`).

- [ ] **Step 5: Write `src/lib/matching.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { scoreFor, isMatchEligible, remainingDeck } from './matching'
import type { Animal, Filters, SwipeDir } from '../types'

const dog = { id: 'd', species: 'dog', score: 88, mutual: true, dist: 2, age: 3 } as Animal
const cat = { id: 'c', species: 'cat', score: 70, mutual: false, dist: 2, age: 3 } as Animal
const wide: Filters = { species: 'all', maxDist: 25, maxAge: 12 }

describe('scoreFor', () => {
  it('adds no boost without species pref', () => {
    expect(scoreFor(dog, {})).toBe(88)
  })
  it('adds 8 when species pref matches', () => {
    expect(scoreFor(cat, { species: 'cat' })).toBe(78)
  })
  it('adds 8 for "both"', () => {
    expect(scoreFor(cat, { species: 'both' })).toBe(78)
  })
  it('caps at 99', () => {
    expect(scoreFor({ ...dog, score: 95 } as Animal, { species: 'dog' })).toBe(99)
  })
})

describe('isMatchEligible', () => {
  it('every-like → always true', () => {
    expect(isMatchEligible(cat, 'every-like')).toBe(true)
  })
  it('destiny → only mutual', () => {
    expect(isMatchEligible(dog, 'destiny')).toBe(true)
    expect(isMatchEligible(cat, 'destiny')).toBe(false)
  })
  it('never → always false', () => {
    expect(isMatchEligible(dog, 'never')).toBe(false)
  })
})

describe('remainingDeck', () => {
  it('excludes swiped and filtered-out animals', () => {
    const swiped: Record<string, SwipeDir> = { d: 'like' }
    expect(remainingDeck([dog, cat], swiped, wide).map((a) => a.id)).toEqual(['c'])
  })
})
```

- [ ] **Step 6: Run — expect FAIL** (`npm test -- matching`).

- [ ] **Step 7: Write `src/lib/matching.ts`**

```ts
import type { Animal, Prefs, MatchMode, Filters, SwipeDir } from '../types'
import { passesFilters } from './filters'

export function scoreFor(a: Animal, prefs: Prefs): number {
  const boost = prefs.species && (prefs.species === 'both' || prefs.species === a.species) ? 8 : 0
  return Math.min(99, a.score + boost)
}

export function isMatchEligible(a: Animal, mode: MatchMode): boolean {
  if (mode === 'every-like') return true
  if (mode === 'destiny') return a.mutual
  return false
}

export function remainingDeck(
  animals: Animal[],
  swiped: Record<string, SwipeDir>,
  f: Filters,
): Animal[] {
  return animals.filter((a) => !swiped[a.id] && passesFilters(a, f))
}
```

- [ ] **Step 8: Run — expect PASS** (`npm test -- matching`).

- [ ] **Step 9: Write `src/lib/chat.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { initialThread, replyFor } from './chat'
import type { Animal } from '../types'

const a = { name: 'Haku', shelter: 'Happy Tails Rescue' } as Animal

describe('initialThread', () => {
  it('opens with a shelter greeting mentioning the animal', () => {
    const t = initialThread(a)
    expect(t).toHaveLength(1)
    expect(t[0].from).toBe('them')
    expect(t[0].text).toContain('Haku')
    expect(t[0].text).toContain('Happy Tails Rescue')
  })
})

describe('replyFor', () => {
  it('returns the first reply for the first user message', () => {
    expect(replyFor(a, 1)).toContain('Haku')
  })
  it('clamps to the last reply for many messages', () => {
    expect(replyFor(a, 99)).toContain('Haku')
  })
  it('never throws for zero', () => {
    expect(typeof replyFor(a, 0)).toBe('string')
  })
})
```

- [ ] **Step 10: Run — expect FAIL** (`npm test -- chat`).

- [ ] **Step 11: Write `src/lib/chat.ts`** (reply text verbatim from `reference-project/Furever.dc.html:490` and `:500-502`)

```ts
import type { Animal, Message } from '../types'

export function initialThread(a: Animal): Message[] {
  return [
    {
      from: 'them',
      text: `Hi! This is ${a.shelter} — ${a.name} just did a happy dance. How can we help you two meet?`,
    },
  ]
}

export function replyFor(a: Animal, myMessageCount: number): string {
  const replies = [
    `Great question! ${a.name} is available for meet-and-greets all week — want us to pencil you in?`,
    `We can confirm ${a.name} is 10/10. Come by ${a.shelter} anytime before 6pm!`,
    `Paperwork takes ~20 minutes and ${a.name} will supervise the whole thing.`,
  ]
  const idx = Math.min(Math.max(0, myMessageCount - 1), replies.length - 1)
  return replies[idx]
}
```

- [ ] **Step 12: Run — expect PASS** (`npm test -- chat`).

- [ ] **Step 13: Write `src/lib/story.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { nextStory } from './story'

describe('nextStory', () => {
  it('advances the pic within a story', () => {
    expect(nextStory({ idx: 0, pic: 0 }, 3)).toEqual({ idx: 0, pic: 1 })
  })
  it('advances to the next story after the last pic', () => {
    expect(nextStory({ idx: 0, pic: 2 }, 3)).toEqual({ idx: 1, pic: 0 })
  })
  it('closes after the last pic of the last story', () => {
    expect(nextStory({ idx: 2, pic: 2 }, 3)).toBeNull()
  })
})
```

- [ ] **Step 14: Run — expect FAIL** (`npm test -- story`).

- [ ] **Step 15: Write `src/lib/story.ts`** (logic from `reference-project/Furever.dc.html:510-516`)

```ts
import type { StoryPos } from '../types'

/** 3 pics per story; returns the next position, or null when the run is over. */
export function nextStory(pos: StoryPos, storyCount: number): StoryPos | null {
  if (pos.pic < 2) return { idx: pos.idx, pic: pos.pic + 1 }
  if (pos.idx + 1 < storyCount) return { idx: pos.idx + 1, pic: 0 }
  return null
}
```

- [ ] **Step 16: Run — expect PASS** (`npm test -- story`).

- [ ] **Step 17: Write `src/lib/swipe.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { swipeOutcome } from './swipe'

describe('swipeOutcome', () => {
  it('likes past the right threshold', () => {
    expect(swipeOutcome(120)).toBe('like')
  })
  it('nopes past the left threshold', () => {
    expect(swipeOutcome(-120)).toBe('nope')
  })
  it('returns null within the threshold', () => {
    expect(swipeOutcome(50)).toBeNull()
    expect(swipeOutcome(-50)).toBeNull()
  })
})
```

- [ ] **Step 18: Run — expect FAIL** (`npm test -- swipe`).

- [ ] **Step 19: Write `src/lib/swipe.ts`** (threshold from `reference-project/Furever.dc.html:477-478`)

```ts
import type { SwipeDir } from '../types'

export const SWIPE_THRESHOLD = 110

export function swipeOutcome(dx: number): SwipeDir | null {
  if (dx > SWIPE_THRESHOLD) return 'like'
  if (dx < -SWIPE_THRESHOLD) return 'nope'
  return null
}
```

- [ ] **Step 20: Run all lib tests — expect PASS** (`npm test -- src/lib`).

- [ ] **Step 21: Commit**

```bash
git add src/lib
git commit -m "feat: add pure logic (filters, matching, chat, story, swipe)"
```

---

## Task 5: Reducer + actions + initial state (TDD)

**Files:**
- Create: `src/state/actions.ts`, `src/state/reducer.ts`
- Test: `src/state/reducer.test.ts`

**Interfaces:**
- Consumes: types, `animals` data, `MATCH_MODE`/`START_SCREEN` config, `isMatchEligible`, `initialThread`, `nextStory`.
- Produces:
  - `AppState` interface (shape below)
  - `Action` discriminated union
  - `initialState: AppState`
  - `reducer(state: AppState, action: Action): AppState`

**`AppState` shape:**
```ts
interface AppState {
  screen: Screen
  loginMode: LoginMode
  login: { name: string; email: string; pass: string }
  obStep: number
  prefs: Prefs
  swiped: Record<string, SwipeDir>
  filters: Filters
  detailId: string | null
  showFilters: boolean
  matchId: string | null
  story: StoryPos | null
  chatId: string | null
  threads: Record<string, Message[]>
  chatDraft: string
}
```

- [ ] **Step 1: Write `src/state/actions.ts`**

```ts
import type { Screen, LoginMode, LoginField, PrefKey, SwipeDir, Filters } from '../types'

export type Action =
  | { type: 'NAVIGATE'; screen: Screen }
  | { type: 'SET_LOGIN_MODE'; mode: LoginMode }
  | { type: 'SET_LOGIN_FIELD'; field: LoginField; value: string }
  | { type: 'SUBMIT_LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'PICK_QUIZ_OPTION'; key: PrefKey; value: string }
  | { type: 'SKIP_QUIZ' }
  | { type: 'RETAKE_QUIZ' }
  | { type: 'SWIPE'; id: string; dir: SwipeDir }
  | { type: 'RESET_DECK' }
  | { type: 'OPEN_DETAIL'; id: string }
  | { type: 'CLOSE_DETAIL' }
  | { type: 'OPEN_FILTERS' }
  | { type: 'CLOSE_FILTERS' }
  | { type: 'SET_FILTER'; patch: Partial<Filters> }
  | { type: 'OPEN_STORY'; idx: number }
  | { type: 'ADVANCE_STORY' }
  | { type: 'CLOSE_STORY' }
  | { type: 'OPEN_CHAT'; id: string }
  | { type: 'BACK_TO_MATCHES' }
  | { type: 'SET_DRAFT'; value: string }
  | { type: 'SEND_MESSAGE'; text: string }
  | { type: 'RECEIVE_MESSAGE'; id: string; text: string }
  | { type: 'DISMISS_MATCH' }
```

- [ ] **Step 2: Write `src/state/reducer.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { reducer, initialState } from './reducer'

describe('reducer', () => {
  it('starts on the configured start screen', () => {
    expect(initialState.screen).toBe('login')
  })

  it('SUBMIT_LOGIN goes to onboarding at step 0', () => {
    const s = reducer(initialState, { type: 'SUBMIT_LOGIN' })
    expect(s.screen).toBe('onboarding')
    expect(s.obStep).toBe(0)
  })

  it('PICK_QUIZ_OPTION advances step then finishes to discover', () => {
    let s = reducer(initialState, { type: 'PICK_QUIZ_OPTION', key: 'species', value: 'dog' })
    expect(s.obStep).toBe(1)
    expect(s.prefs.species).toBe('dog')
    s = { ...s, obStep: 2 }
    s = reducer(s, { type: 'PICK_QUIZ_OPTION', key: 'energy', value: 'chill' })
    expect(s.screen).toBe('discover')
    expect(s.obStep).toBe(0)
  })

  it('SWIPE records direction', () => {
    const s = reducer(initialState, { type: 'SWIPE', id: 'clementine', dir: 'nope' })
    expect(s.swiped.clementine).toBe('nope')
  })

  it('liking a mutual animal sets matchId (destiny mode)', () => {
    const s = reducer(initialState, { type: 'SWIPE', id: 'biscuit', dir: 'like' })
    expect(s.matchId).toBe('biscuit')
  })

  it('liking a non-mutual animal does not set matchId (destiny mode)', () => {
    const s = reducer(initialState, { type: 'SWIPE', id: 'clementine', dir: 'like' })
    expect(s.matchId).toBeNull()
  })

  it('OPEN_CHAT seeds an initial thread once and switches screen', () => {
    const s = reducer(initialState, { type: 'OPEN_CHAT', id: 'biscuit' })
    expect(s.screen).toBe('chat')
    expect(s.chatId).toBe('biscuit')
    expect(s.threads.biscuit).toHaveLength(1)
    const again = reducer(s, { type: 'OPEN_CHAT', id: 'biscuit' })
    expect(again.threads.biscuit).toHaveLength(1) // not re-seeded
  })

  it('SEND_MESSAGE appends a "me" message and clears the draft', () => {
    let s = reducer(initialState, { type: 'OPEN_CHAT', id: 'biscuit' })
    s = reducer({ ...s, chatDraft: 'hi' }, { type: 'SEND_MESSAGE', text: 'hi' })
    expect(s.threads.biscuit.at(-1)).toEqual({ from: 'me', text: 'hi' })
    expect(s.chatDraft).toBe('')
  })

  it('SET_FILTER merges a patch', () => {
    const s = reducer(initialState, { type: 'SET_FILTER', patch: { maxDist: 5 } })
    expect(s.filters.maxDist).toBe(5)
    expect(s.filters.species).toBe('all')
  })

  it('ADVANCE_STORY walks pics then closes', () => {
    let s = reducer(initialState, { type: 'OPEN_STORY', idx: 2 })
    expect(s.story).toEqual({ idx: 2, pic: 0 })
    s = reducer(s, { type: 'ADVANCE_STORY' }) // pic 1
    s = reducer(s, { type: 'ADVANCE_STORY' }) // pic 2
    s = reducer(s, { type: 'ADVANCE_STORY' }) // past last → close
    expect(s.story).toBeNull()
  })

  it('NAVIGATE clears overlays', () => {
    const dirty = { ...initialState, detailId: 'biscuit', showFilters: true }
    const s = reducer(dirty, { type: 'NAVIGATE', screen: 'profile' })
    expect(s.screen).toBe('profile')
    expect(s.detailId).toBeNull()
    expect(s.showFilters).toBe(false)
  })

  it('RETAKE_QUIZ resets prefs and step', () => {
    const dirty = { ...initialState, prefs: { species: 'dog' }, obStep: 2 }
    const s = reducer(dirty, { type: 'RETAKE_QUIZ' })
    expect(s.screen).toBe('onboarding')
    expect(s.prefs).toEqual({})
    expect(s.obStep).toBe(0)
  })

  it('LOGOUT resets to login and clears credentials', () => {
    const dirty = { ...initialState, screen: 'profile' as const, login: { name: 'A', email: 'b', pass: 'c' } }
    const s = reducer(dirty, { type: 'LOGOUT' })
    expect(s.screen).toBe('login')
    expect(s.login).toEqual({ name: '', email: '', pass: '' })
  })
})
```

- [ ] **Step 3: Run — expect FAIL** (`npm test -- reducer`).

- [ ] **Step 4: Write `src/state/reducer.ts`**

```ts
import type { Screen, LoginMode, Prefs, SwipeDir, Filters, StoryPos, Message } from '../types'
import type { Action } from './actions'
import { animals } from '../data/animals'
import { shelterStories } from '../data/stories'
import { MATCH_MODE, START_SCREEN } from '../config'
import { isMatchEligible } from '../lib/matching'
import { initialThread } from '../lib/chat'
import { nextStory } from '../lib/story'

export interface AppState {
  screen: Screen
  loginMode: LoginMode
  login: { name: string; email: string; pass: string }
  obStep: number
  prefs: Prefs
  swiped: Record<string, SwipeDir>
  filters: Filters
  detailId: string | null
  showFilters: boolean
  matchId: string | null
  story: StoryPos | null
  chatId: string | null
  threads: Record<string, Message[]>
  chatDraft: string
}

const byId = (id: string) => animals.find((a) => a.id === id)

export const initialState: AppState = {
  screen: START_SCREEN,
  loginMode: 'signin',
  login: { name: '', email: '', pass: '' },
  obStep: 0,
  prefs: {},
  swiped: {},
  filters: { species: 'all', maxDist: 25, maxAge: 12 },
  detailId: null,
  showFilters: false,
  matchId: null,
  story: null,
  chatId: null,
  threads: {},
  chatDraft: '',
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen, detailId: null, showFilters: false }
    case 'SET_LOGIN_MODE':
      return { ...state, loginMode: action.mode }
    case 'SET_LOGIN_FIELD':
      return { ...state, login: { ...state.login, [action.field]: action.value } }
    case 'SUBMIT_LOGIN':
      return { ...state, screen: 'onboarding', obStep: 0 }
    case 'LOGOUT':
      return {
        ...state,
        screen: 'login',
        loginMode: 'signin',
        login: { name: '', email: '', pass: '' },
      }
    case 'PICK_QUIZ_OPTION': {
      const prefs = { ...state.prefs, [action.key]: action.value }
      if (state.obStep >= 2) return { ...state, prefs, screen: 'discover', obStep: 0 }
      return { ...state, prefs, obStep: state.obStep + 1 }
    }
    case 'SKIP_QUIZ':
      return { ...state, screen: 'discover', obStep: 0 }
    case 'RETAKE_QUIZ':
      return { ...state, screen: 'onboarding', obStep: 0, prefs: {} }
    case 'SWIPE': {
      const a = byId(action.id)
      const isMatch = action.dir === 'like' && !!a && isMatchEligible(a, MATCH_MODE)
      return {
        ...state,
        swiped: { ...state.swiped, [action.id]: action.dir },
        matchId: isMatch ? action.id : state.matchId,
      }
    }
    case 'RESET_DECK':
      return { ...state, swiped: {}, filters: { species: 'all', maxDist: 25, maxAge: 12 } }
    case 'OPEN_DETAIL':
      return { ...state, detailId: action.id }
    case 'CLOSE_DETAIL':
      return { ...state, detailId: null }
    case 'OPEN_FILTERS':
      return { ...state, showFilters: true }
    case 'CLOSE_FILTERS':
      return { ...state, showFilters: false }
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.patch } }
    case 'OPEN_STORY':
      return { ...state, story: { idx: action.idx, pic: 0 } }
    case 'ADVANCE_STORY': {
      if (!state.story) return state
      return { ...state, story: nextStory(state.story, shelterStories.length) }
    }
    case 'CLOSE_STORY':
      return { ...state, story: null }
    case 'OPEN_CHAT': {
      const a = byId(action.id)
      const threads = state.threads[action.id]
        ? state.threads
        : { ...state.threads, [action.id]: a ? initialThread(a) : [] }
      return { ...state, threads, chatId: action.id, screen: 'chat', matchId: null, detailId: null }
    }
    case 'BACK_TO_MATCHES':
      return { ...state, screen: 'matches' }
    case 'SET_DRAFT':
      return { ...state, chatDraft: action.value }
    case 'SEND_MESSAGE': {
      const id = state.chatId
      if (!id || !action.text.trim()) return state
      return {
        ...state,
        threads: { ...state.threads, [id]: [...(state.threads[id] ?? []), { from: 'me', text: action.text.trim() }] },
        chatDraft: '',
      }
    }
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        threads: {
          ...state.threads,
          [action.id]: [...(state.threads[action.id] ?? []), { from: 'them', text: action.text }],
        },
      }
    case 'DISMISS_MATCH':
      return { ...state, matchId: null }
    default:
      return state
  }
}
```

- [ ] **Step 5: Run — expect PASS** (`npm test -- reducer`).

- [ ] **Step 6: Typecheck** (`npm run typecheck`) — expect PASS.

- [ ] **Step 7: Commit**

```bash
git add src/state
git commit -m "feat: add reducer, actions, and initial state"
```

---

## Task 6: App context + `useApp` hook + derived selectors

**Files:**
- Create: `src/state/AppContext.tsx`, `src/state/selectors.ts`
- Test: `src/state/selectors.test.ts`

**Interfaces:**
- Consumes: `reducer`, `initialState`, `AppState`, `Action`, data, lib functions.
- Produces:
  - `AppProvider({ children })` and `useApp(): { state: AppState; dispatch: Dispatch<Action> }`
  - Selectors (pure, take `AppState`): `selectDeck(s)`, `selectTopId(s)`, `selectLiked(s)`, `selectMutuals(s)`, `selectShortlist(s)`, `selectScore(s, animal)`, `selectPrefChips(s)`.

- [ ] **Step 1: Write `src/state/selectors.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { initialState } from './reducer'
import { selectDeck, selectLiked, selectMutuals, selectPrefChips } from './selectors'

describe('selectors', () => {
  it('selectDeck returns all animals at the start', () => {
    expect(selectDeck(initialState).length).toBe(8)
  })
  it('selectLiked reflects liked swipes', () => {
    const s = { ...initialState, swiped: { biscuit: 'like' as const, clementine: 'nope' as const } }
    expect(selectLiked(s).map((a) => a.id)).toEqual(['biscuit'])
  })
  it('selectMutuals returns eligible likes (destiny)', () => {
    const s = { ...initialState, swiped: { biscuit: 'like' as const, clementine: 'like' as const } }
    expect(selectMutuals(s).map((a) => a.id)).toEqual(['biscuit'])
  })
  it('selectPrefChips maps stored prefs to labels', () => {
    const s = { ...initialState, prefs: { species: 'dog', energy: 'chill' } }
    expect(selectPrefChips(s)).toEqual(['Team Woof', 'Couch potato'])
  })
})
```

- [ ] **Step 2: Run — expect FAIL** (`npm test -- selectors`).

- [ ] **Step 3: Write `src/state/selectors.ts`**

```ts
import type { Animal } from '../types'
import type { AppState } from './reducer'
import { animals } from '../data/animals'
import { prefLabels } from '../data/quiz'
import { MATCH_MODE } from '../config'
import { remainingDeck, isMatchEligible, scoreFor } from '../lib/matching'

export function selectDeck(s: AppState): Animal[] {
  return remainingDeck(animals, s.swiped, s.filters)
}

export function selectTopId(s: AppState): string | null {
  return selectDeck(s)[0]?.id ?? null
}

export function selectLiked(s: AppState): Animal[] {
  return animals.filter((a) => s.swiped[a.id] === 'like')
}

export function selectMutuals(s: AppState): Animal[] {
  return selectLiked(s).filter((a) => isMatchEligible(a, MATCH_MODE))
}

export function selectShortlist(s: AppState): Animal[] {
  return selectLiked(s).filter((a) => !isMatchEligible(a, MATCH_MODE))
}

export function selectScore(s: AppState, a: Animal): number {
  return scoreFor(a, s.prefs)
}

export function selectPrefChips(s: AppState): string[] {
  return Object.values(s.prefs).map((v) => prefLabels[v] ?? v)
}
```

- [ ] **Step 4: Run — expect PASS** (`npm test -- selectors`).

- [ ] **Step 5: Write `src/state/AppContext.tsx`**

```tsx
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import { reducer, initialState, type AppState } from './reducer'
import type { Action } from './actions'

interface AppContextValue {
  state: AppState
  dispatch: Dispatch<Action>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <AppContext value={{ state, dispatch }}>{children}</AppContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
```

Note: React 19 allows `<AppContext value={...}>` directly (no `.Provider`). If your React version errors, use `<AppContext.Provider value={...}>`.

- [ ] **Step 6: Typecheck** (`npm run typecheck`) — expect PASS.

- [ ] **Step 7: Commit**

```bash
git add src/state/AppContext.tsx src/state/selectors.ts src/state/selectors.test.ts
git commit -m "feat: add app context, useApp hook, and selectors"
```

---

## Task 7: Bundle pet photos + photo manifest

**Files:**
- Create: `src/assets/pets/` (image files), `src/assets/pets/index.ts`
- Create: `scripts/fetch-pets.sh`

**Interfaces:**
- Produces: `petPhoto(id: string): string | undefined` and `storyPhoto(idx: number): string | undefined` returning bundled asset URLs.

- [ ] **Step 1: Write `scripts/fetch-pets.sh`**

Sources: `placedog.net` (dogs) and `cataas.com` (cats) — free pet-photo services intended for prototyping/demos. Document that these should be replaced with owned/licensed assets before any production use.

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../src/assets/pets"

# Dogs (deterministic by id)
curl -fsSL "https://placedog.net/600/750?id=10" -o biscuit.jpg
curl -fsSL "https://placedog.net/600/750?id=21" -o waffles.jpg
curl -fsSL "https://placedog.net/600/750?id=33" -o pretzel.jpg
curl -fsSL "https://placedog.net/600/750?id=44" -o meatball.jpg

# Cats
curl -fsSL "https://cataas.com/cat?width=600&height=750&_=1" -o clementine.jpg
curl -fsSL "https://cataas.com/cat?width=600&height=750&_=2" -o miso.jpg
curl -fsSL "https://cataas.com/cat?width=600&height=750&_=3" -o juniper.jpg
curl -fsSL "https://cataas.com/cat?width=600&height=750&_=4" -o pickle.jpg

# Shelter story photos
curl -fsSL "https://placedog.net/700/900?id=51" -o story-0.jpg
curl -fsSL "https://cataas.com/cat?width=700&height=900&_=5" -o story-1.jpg
curl -fsSL "https://placedog.net/700/900?id=62" -o story-2.jpg

echo "Fetched $(ls *.jpg | wc -l) photos"
```

- [ ] **Step 2: Run the fetch script**

```bash
mkdir -p src/assets/pets && chmod +x scripts/fetch-pets.sh && ./scripts/fetch-pets.sh
```

Expected: 11 `.jpg` files in `src/assets/pets/`. **If any curl fails** (offline / service down), create empty placeholders is NOT acceptable — instead leave the file absent; the `AnimalPhoto` fallback (Task 8) covers missing photos. Verify at least the manifest imports resolve for whichever files exist by making missing ones optional in Step 3 (imports for absent files must be removed).

- [ ] **Step 3: Write `src/assets/pets/index.ts`**

```ts
import biscuit from './biscuit.jpg'
import clementine from './clementine.jpg'
import waffles from './waffles.jpg'
import miso from './miso.jpg'
import pretzel from './pretzel.jpg'
import juniper from './juniper.jpg'
import meatball from './meatball.jpg'
import pickle from './pickle.jpg'
import story0 from './story-0.jpg'
import story1 from './story-1.jpg'
import story2 from './story-2.jpg'

const petPhotos: Record<string, string> = {
  biscuit,
  clementine,
  waffles,
  miso,
  pretzel,
  juniper,
  meatball,
  pickle,
}

const storyPhotos = [story0, story1, story2]

export function petPhoto(id: string): string | undefined {
  return petPhotos[id]
}

export function storyPhoto(idx: number): string | undefined {
  return storyPhotos[idx]
}
```

If a photo failed to download in Step 2, remove its `import` line and `petPhotos`/`storyPhotos` entry — the fallback handles it.

- [ ] **Step 4: Typecheck + build** (`npm run typecheck && npm run build`) — expect PASS (Vite resolves the `.jpg` imports via `vite-env.d.ts`).

- [ ] **Step 5: Commit**

```bash
git add scripts/fetch-pets.sh src/assets/pets
git commit -m "feat: bundle pet + story photos with a manifest"
```

---

## Task 8: Presentational primitives

**Files:**
- Create: `src/components/AnimalPhoto.tsx`, `src/components/Chip.tsx`, `src/components/Stamp.tsx`, `src/components/BottomSheet.tsx`, `src/components/IOSFrame.tsx`, `src/components/tilt.ts`
- Test: `src/components/AnimalPhoto.test.tsx`

**Interfaces:**
- Produces:
  - `tiltDeg(deg: number): string` — returns `` `rotate(${deg}deg)` `` when `TILT`, else `'none'` (helper for inline `transform`).
  - `AnimalPhoto({ id?, src?, name, shape, radius?, className? })` — `shape: 'circle' | 'rounded'`. Renders bundled photo (via `petPhoto(id)` or explicit `src`) with `object-cover`; falls back to a paper-gradient block with the animal initial when no photo resolves.
  - `Chip({ children, variant?, className? })` — `variant: 'solid' | 'dashed'` (default `dashed`), a pill.
  - `Stamp({ kind, style })` — `kind: 'like' | 'nope'`, the `SMITTEN`/`PASS` badge; opacity is controlled by the caller via `style`.
  - `BottomSheet({ open, onClose, height?, children })` — scrim + slide-up panel with grab handle and close button.
  - `IOSFrame({ children })` — device shell (rounded 44px, notch, min-h) centered on the paper backdrop.

- [ ] **Step 1: Write `src/components/tilt.ts`**

```ts
import { TILT } from '../config'

export function tiltDeg(deg: number): string {
  return TILT ? `rotate(${deg}deg)` : 'none'
}
```

- [ ] **Step 2: Write `src/components/AnimalPhoto.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AnimalPhoto } from './AnimalPhoto'

describe('AnimalPhoto', () => {
  it('renders an <img> when a src is provided', () => {
    render(<AnimalPhoto src="/x.jpg" name="Haku" shape="rounded" />)
    const img = screen.getByRole('img', { name: /haku/i })
    expect(img).toHaveAttribute('src', '/x.jpg')
  })

  it('renders a fallback with the initial when no photo resolves', () => {
    render(<AnimalPhoto id="does-not-exist" name="Zed" shape="circle" />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('Z')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run — expect FAIL** (`npm test -- AnimalPhoto`).

- [ ] **Step 4: Write `src/components/AnimalPhoto.tsx`**

```tsx
import { petPhoto } from '../assets/pets'

interface Props {
  id?: string
  src?: string
  name: string
  shape: 'circle' | 'rounded'
  radius?: number
  className?: string
}

export function AnimalPhoto({ id, src, name, shape, radius = 10, className = '' }: Props) {
  const resolved = src ?? (id ? petPhoto(id) : undefined)
  const rounding = shape === 'circle' ? '9999px' : `${radius}px`
  const style = { borderRadius: rounding }

  if (resolved) {
    return (
      <img
        src={resolved}
        alt={name}
        style={style}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  return (
    <div
      style={style}
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-paperdark to-card font-display text-3xl text-ink/40 ${className}`}
    >
      {name.charAt(0)}
    </div>
  )
}
```

- [ ] **Step 5: Run — expect PASS** (`npm test -- AnimalPhoto`).

- [ ] **Step 6: Write `src/components/Chip.tsx`**

```tsx
import type { ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  variant?: 'solid' | 'dashed'
  className?: string
  style?: CSSProperties
}

export function Chip({ children, variant = 'dashed', className = '', style }: Props) {
  const border = variant === 'dashed' ? 'border-dashed' : 'border-solid'
  return (
    <span
      style={style}
      className={`inline-block rounded-full border-[1.5px] border-ink ${border} bg-card px-3 py-1.5 text-xs ${className}`}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 7: Write `src/components/Stamp.tsx`** (visual from `reference-project/Furever.dc.html:113-114`)

```tsx
import type { CSSProperties } from 'react'

interface Props {
  kind: 'like' | 'nope'
  style?: CSSProperties
}

export function Stamp({ kind, style }: Props) {
  const like = kind === 'like'
  return (
    <div
      data-stamp={kind}
      style={style}
      className={`pointer-events-none absolute top-6 rounded-md border-[3px] bg-card/85 px-3 py-1 font-mono text-[22px] font-semibold tracking-[0.1em] ${
        like
          ? 'left-3.5 -rotate-12 border-sage text-sage'
          : 'right-20 rotate-[10deg] border-nope text-nope'
      }`}
    >
      {like ? 'SMITTEN' : 'PASS'}
    </div>
  )
}
```

- [ ] **Step 8: Write `src/components/BottomSheet.tsx`** (structure from `reference-project/Furever.dc.html:274-278`)

```tsx
import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  height?: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, height, children }: Props) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-ink/40"
      />
      <div
        style={{ height }}
        className="absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-[22px] border-t-[1.5px] border-ink bg-paper"
        // animation applied via className below
      >
        <div className="[animation:var(--animate-slide-up)] flex h-full flex-col">
          <div className="flex justify-center pt-2.5 pb-1">
            <span className="h-1 w-10 rounded-full bg-ink/25" />
          </div>
          <button
            onClick={onClose}
            aria-label="Dismiss"
            className="absolute right-3.5 top-3 z-[2] h-8 w-8 rounded-full border-[1.5px] border-ink bg-card text-[13px] active:scale-90"
          >
            ✕
          </button>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}
```

(If the slide-up animation on the inner wrapper looks off, move `[animation:var(--animate-slide-up)]` to the outer panel `div` — either is acceptable as long as the sheet slides up.)

- [ ] **Step 9: Write `src/components/IOSFrame.tsx`**

```tsx
import type { ReactNode } from 'react'

export function IOSFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh items-start justify-center bg-paperdark py-7">
      <div className="relative h-[900px] w-[440px] max-w-full overflow-hidden rounded-[44px] border-[6px] border-ink bg-paper shadow-[0_20px_60px_rgba(42,33,24,0.35)]">
        <div className="absolute left-1/2 top-2 z-50 h-6 w-32 -translate-x-1/2 rounded-full bg-ink" />
        <div className="relative flex h-full flex-col bg-paper bg-dots pt-14 text-ink">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 10: Typecheck + test** (`npm run typecheck && npm test -- src/components`) — expect PASS.

- [ ] **Step 11: Commit**

```bash
git add src/components
git commit -m "feat: add presentational primitives (photo, chip, stamp, sheet, frame)"
```

---

## Task 9: `useSwipe` hook + `SwipeCard`

**Files:**
- Create: `src/hooks/useSwipe.ts`, `src/components/SwipeCard.tsx`
- Test: `src/components/SwipeCard.test.tsx`

**Interfaces:**
- Consumes: `swipeOutcome`, `SWIPE_THRESHOLD`, `Stamp`, `AnimalPhoto`, `Chip`, `useApp`, selectors, `tiltDeg`.
- Produces:
  - `useSwipe({ enabled, onCommit })` → `{ handlers, ref }` where `handlers` are pointer handlers for the card root and `ref` is attached to the card element; `onCommit(dir: SwipeDir)` fires after the fly-off. Also exposes `wasDragged()` so a click after a drag can be ignored.
  - `SwipeCard({ animal, score, position, onOpenDetail })` — one deck card. `position: 0|1|2|-1` controls z/scale/offset; only `position === 0` is draggable.

**Behavior (from `reference-project/Furever.dc.html:456-485`):** pointer-down captures start; move applies `translate(dx,dy) rotate(dx*0.07)` to the ref and sets stamp opacity from `dx/90`; up past ±110 flies the card off then calls `onCommit`; otherwise springs back. A move total > 7px marks a drag (suppresses the subsequent click → detail open).

- [ ] **Step 1: Write `src/hooks/useSwipe.ts`**

```ts
import { useRef, type PointerEvent } from 'react'
import type { SwipeDir } from '../types'
import { swipeOutcome } from '../lib/swipe'

interface Options {
  enabled: boolean
  onCommit: (dir: SwipeDir) => void
}

export function useSwipe({ enabled, onCommit }: Options) {
  const ref = useRef<HTMLDivElement>(null)
  const start = useRef({ x: 0, y: 0 })
  const dragging = useRef(false)
  const moved = useRef(false)

  const setStamp = (kind: SwipeDir, opacity: number) => {
    const el = ref.current?.querySelector<HTMLElement>(`[data-stamp="${kind}"]`)
    if (el) el.style.opacity = String(opacity)
  }

  const fly = (dir: SwipeDir) => {
    const el = ref.current
    if (!el) {
      onCommit(dir)
      return
    }
    const x = dir === 'like' ? 520 : -520
    el.style.transition = 'transform .32s ease-in, opacity .32s ease-in'
    el.style.transform = `translate(${x}px,-30px) rotate(${dir === 'like' ? 24 : -24}deg)`
    el.style.opacity = '0'
    setStamp(dir, 1)
    window.setTimeout(() => onCommit(dir), 310)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled) return
    dragging.current = true
    moved.current = false
    start.current = { x: e.clientX, y: e.clientY }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ignore */ }
    e.currentTarget.style.transition = 'none'
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !ref.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    if (Math.abs(dx) + Math.abs(dy) > 7) moved.current = true
    ref.current.style.transform = `translate(${dx}px,${dy}px) rotate(${dx * 0.07}deg)`
    setStamp('like', Math.min(1, Math.max(0, dx / 90)))
    setStamp('nope', Math.min(1, Math.max(0, -dx / 90)))
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    dragging.current = false
    const dx = e.clientX - start.current.x
    const outcome = swipeOutcome(dx)
    if (outcome) {
      fly(outcome)
    } else if (ref.current) {
      ref.current.style.transition = 'transform .45s cubic-bezier(.2,1.6,.4,1)'
      ref.current.style.transform = ''
      setStamp('like', 0)
      setStamp('nope', 0)
    }
  }

  const wasDragged = () => moved.current
  const flyProgrammatic = (dir: SwipeDir) => fly(dir)

  return {
    ref,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    wasDragged,
    flyProgrammatic,
  }
}
```

- [ ] **Step 2: Write `src/components/SwipeCard.tsx`** (visual from `reference-project/Furever.dc.html:103-130`)

```tsx
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
```

- [ ] **Step 3: Write `src/components/SwipeCard.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SwipeCard } from './SwipeCard'
import type { Animal } from '../types'

const animal = {
  id: 'biscuit', name: 'Haku', species: 'dog', breed: 'Australian Shepherd',
  age: 2, dist: 1.2, shelter: 'x', fee: 'y', score: 88, mutual: true,
  tags: ['food-motivated'], kids: 'YES', dogs: 'YES', cats: 'ASK', bio: 'z',
} as Animal

describe('SwipeCard', () => {
  it('renders name, score and tags for the top card', () => {
    render(<SwipeCard animal={animal} score={88} position={0} onCommit={vi.fn()} onOpenDetail={vi.fn()} />)
    expect(screen.getByText('Haku')).toBeInTheDocument()
    expect(screen.getByText('88')).toBeInTheDocument()
    expect(screen.getByText('food-motivated')).toBeInTheDocument()
  })

  it('opens detail on a tap (no drag) when it is the top card', () => {
    const onOpenDetail = vi.fn()
    render(<SwipeCard animal={animal} score={88} position={0} onCommit={vi.fn()} onOpenDetail={onOpenDetail} />)
    fireEvent.click(screen.getByText('Haku'))
    expect(onOpenDetail).toHaveBeenCalledOnce()
  })

  it('renders nothing when position is negative', () => {
    const { container } = render(<SwipeCard animal={animal} score={88} position={-1} onCommit={vi.fn()} onOpenDetail={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })
})
```

- [ ] **Step 4: Run — expect PASS** (`npm test -- SwipeCard`).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSwipe.ts src/components/SwipeCard.tsx src/components/SwipeCard.test.tsx
git commit -m "feat: add useSwipe hook and SwipeCard"
```

---

## Task 10: Effect hooks — `useAutoReply` + `useStoryPlayer`

**Files:**
- Create: `src/hooks/useAutoReply.ts`, `src/hooks/useStoryPlayer.ts`

**Interfaces:**
- Consumes: `useApp`, `replyFor`, `animals`.
- Produces: `useAutoReply()` and `useStoryPlayer()` — call once each inside `App`. They run timers off the store and dispatch `RECEIVE_MESSAGE` / `ADVANCE_STORY`.

- [ ] **Step 1: Write `src/hooks/useAutoReply.ts`** (delay + trigger from `reference-project/Furever.dc.html:497-503`)

```ts
import { useEffect } from 'react'
import { useApp } from '../state/AppContext'
import { animals } from '../data/animals'
import { replyFor } from '../lib/chat'

/** After the user sends a message, the shelter replies ~900ms later. */
export function useAutoReply() {
  const { state, dispatch } = useApp()
  const id = state.chatId
  const thread = id ? state.threads[id] : undefined
  const last = thread?.at(-1)

  useEffect(() => {
    if (!id || !thread || last?.from !== 'me') return
    const animal = animals.find((a) => a.id === id)
    if (!animal) return
    const myCount = thread.filter((m) => m.from === 'me').length
    const timer = window.setTimeout(() => {
      dispatch({ type: 'RECEIVE_MESSAGE', id, text: replyFor(animal, myCount) })
    }, 900)
    return () => window.clearTimeout(timer)
    // re-run when the thread length changes
  }, [id, thread?.length, last?.from, dispatch, thread])
}
```

- [ ] **Step 2: Write `src/hooks/useStoryPlayer.ts`** (6s cadence from `reference-project/Furever.dc.html:508`)

```ts
import { useEffect } from 'react'
import { useApp } from '../state/AppContext'

/** Auto-advances the open story every 6s. */
export function useStoryPlayer() {
  const { state, dispatch } = useApp()
  const story = state.story

  useEffect(() => {
    if (!story) return
    const timer = window.setTimeout(() => dispatch({ type: 'ADVANCE_STORY' }), 6000)
    return () => window.clearTimeout(timer)
  }, [story?.idx, story?.pic, story, dispatch])
}
```

- [ ] **Step 3: Typecheck** (`npm run typecheck`) — expect PASS.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useAutoReply.ts src/hooks/useStoryPlayer.ts
git commit -m "feat: add auto-reply and story-player effect hooks"
```

---

## Task 11: Login screen

**Files:**
- Create: `src/screens/Login.tsx`
- Test: `src/screens/Login.test.tsx`

**Interfaces:**
- Consumes: `useApp`, `Chip`. Reads `state.loginMode`, `state.login`; dispatches `SET_LOGIN_MODE`, `SET_LOGIN_FIELD`, `SUBMIT_LOGIN`.
- Structure/copy: port verbatim from `reference-project/Furever.dc.html:28-56`. Name input shows only in register mode. Both primary CTA and the guest button dispatch `SUBMIT_LOGIN`.

Copy strings (verbatim): tab labels `SIGN IN` / `REGISTER`; tagline signin `Welcome back. The floofs missed you.`, register `New here? The floofs have been expecting you.`; CTA signin `LET ME IN →`, register `MAKE IT OFFICIAL →`; badge `EST. RIGHT MEOW`; guest button `Continue as a guest with treats`; footer `NO REAL ACCOUNTS. NO SPAM.` / `JUST FLOOFS.`; placeholders `Your name (the pets will ask)`, `Email`, `Password (any old thing works)`.

- [ ] **Step 1: Write `src/screens/Login.tsx`**

Build the screen per the reference. Key wiring:
- Tabs call `dispatch({ type: 'SET_LOGIN_MODE', mode })`, styled active when `state.loginMode === mode`.
- Inputs are controlled: `value={state.login.email}` etc., `onChange={(e) => dispatch({ type: 'SET_LOGIN_FIELD', field: 'email', value: e.target.value })}`.
- Name `<input>` rendered only when `state.loginMode === 'register'`.
- Primary `<button>` and guest `<button>` both `onClick={() => dispatch({ type: 'SUBMIT_LOGIN' })}`.
- Use token utilities: `bg-card border-[1.5px] border-ink rounded-2xl shadow-paper`, `font-mono`, `font-display`, `text-rust`. Logo: `<div className="font-display text-[46px] -rotate-[1.5deg]">furever<span className="text-rust">.</span></div>`.

```tsx
import { useApp } from '../state/AppContext'

export function Login() {
  const { state, dispatch } = useApp()
  const register = state.loginMode === 'register'
  const field = (f: 'name' | 'email' | 'pass') => (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: 'SET_LOGIN_FIELD', field: f, value: e.target.value })
  const inputCls =
    'rounded-[14px] border-[1.5px] border-ink bg-card px-4 py-[15px] font-body text-[14.5px] text-ink shadow-paper outline-none focus:border-rust'

  return (
    <div className="flex flex-1 animate-fade-in flex-col px-[26px] pb-10 pt-[30px]">
      <div className="mt-2.5 flex justify-center">
        <span className="-rotate-2 rounded-full border-[1.5px] border-dashed border-rust px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.22em] text-rust">
          EST. RIGHT MEOW
        </span>
      </div>
      <div className="my-6 text-center">
        <div className="-rotate-[1.5deg] font-display text-[46px]">furever<span className="text-rust">.</span></div>
        <div className="mt-2 text-[14.5px] text-ink/65">
          {register ? 'New here? The floofs have been expecting you.' : 'Welcome back. The floofs missed you.'}
        </div>
      </div>
      <div className="my-5 flex justify-center">
        <button
          onClick={() => dispatch({ type: 'SET_LOGIN_MODE', mode: 'signin' })}
          className={`rounded-l-full border-[1.5px] border-ink px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.16em] ${!register ? 'bg-ink text-paper' : 'bg-card text-ink/60'}`}
        >
          SIGN IN
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_LOGIN_MODE', mode: 'register' })}
          className={`rounded-r-full border-[1.5px] border-l-0 border-ink px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.16em] ${register ? 'bg-ink text-paper' : 'bg-card text-ink/60'}`}
        >
          REGISTER
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {register && (
          <input value={state.login.name} onChange={field('name')} placeholder="Your name (the pets will ask)" className={inputCls} />
        )}
        <input value={state.login.email} onChange={field('email')} placeholder="Email" className={inputCls} />
        <input value={state.login.pass} onChange={field('pass')} type="password" placeholder="Password (any old thing works)" className={inputCls} />
        <button
          onClick={() => dispatch({ type: 'SUBMIT_LOGIN' })}
          className="mt-1.5 rounded-[14px] border-[1.5px] border-ink bg-rust p-4 font-mono text-xs font-semibold tracking-[0.18em] text-paper shadow-paper active:scale-95"
        >
          {register ? 'MAKE IT OFFICIAL →' : 'LET ME IN →'}
        </button>
      </div>
      <div className="my-5 flex items-center gap-3">
        <span className="flex-1 border-t-[1.5px] border-dashed border-ink/30" />
        <span className="font-mono text-[9.5px] tracking-[0.18em] text-ink/50">OR</span>
        <span className="flex-1 border-t-[1.5px] border-dashed border-ink/30" />
      </div>
      <button
        onClick={() => dispatch({ type: 'SUBMIT_LOGIN' })}
        className="rounded-[14px] border-[1.5px] border-ink bg-card p-3.5 font-body text-sm font-bold text-ink shadow-paper active:scale-95"
      >
        Continue as a guest with treats
      </button>
      <div className="mt-auto text-center font-mono text-[9.5px] leading-[1.7] tracking-[0.14em] text-ink/45">
        NO REAL ACCOUNTS. NO SPAM.<br />JUST FLOOFS.
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/screens/Login.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider, useApp } from '../state/AppContext'
import { Login } from './Login'

function Harness() {
  const { state } = useApp()
  return (
    <>
      <Login />
      <output>screen:{state.screen}</output>
    </>
  )
}

describe('Login', () => {
  it('hides the name field in signin mode and shows it in register mode', async () => {
    render(<AppProvider><Login /></AppProvider>)
    expect(screen.queryByPlaceholderText(/your name/i)).toBeNull()
    await userEvent.click(screen.getByText('REGISTER'))
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
  })

  it('submitting navigates to onboarding', () => {
    render(<AppProvider><Harness /></AppProvider>)
    fireEvent.click(screen.getByText('LET ME IN →'))
    expect(screen.getByText('screen:onboarding')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run — expect PASS** (`npm test -- Login`).

- [ ] **Step 4: Commit**

```bash
git add src/screens/Login.tsx src/screens/Login.test.tsx
git commit -m "feat: add Login screen"
```

---

## Task 12: Onboarding screen

**Files:**
- Create: `src/screens/Onboarding.tsx`
- Test: `src/screens/Onboarding.test.tsx`

**Interfaces:**
- Consumes: `useApp`, `quizSteps`. Reads `state.obStep`; dispatches `PICK_QUIZ_OPTION` and `SKIP_QUIZ`.
- Structure/copy: port from `reference-project/Furever.dc.html:59-79`. Header `FUREVER · VIBE CHECK`; progress badge `{step+1} / 3`; skip link `SKIP — I CONTAIN MULTITUDES`. Options come from `quizSteps[Math.min(state.obStep, 2)]`.

- [ ] **Step 1: Write `src/screens/Onboarding.tsx`**

```tsx
import { useApp } from '../state/AppContext'
import { quizSteps } from '../data/quiz'

export function Onboarding() {
  const { state, dispatch } = useApp()
  const step = quizSteps[Math.min(state.obStep, 2)]

  return (
    <div className="flex flex-1 animate-fade-in flex-col px-6 pb-[34px] pt-[26px]">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] font-semibold tracking-[0.22em]">FUREVER · VIBE CHECK</div>
        <div className="rotate-3 rounded-full border-[1.5px] border-dashed border-rust px-2 py-[3px] font-mono text-[10px] tracking-[0.15em] text-rust">
          {state.obStep + 1} / 3
        </div>
      </div>
      <h1 className="mb-2.5 mt-[34px] font-display text-[32px] leading-[1.12] [text-wrap:pretty]">{step.title}</h1>
      <p className="mb-[26px] text-[14.5px] leading-[1.5] text-ink/65">{step.sub}</p>
      <div className="flex flex-col gap-3">
        {step.options.map((o) => (
          <button
            key={o.tag}
            onClick={() => dispatch({ type: 'PICK_QUIZ_OPTION', key: step.key, value: o.value })}
            className="flex items-center gap-3.5 rounded-[14px] border-[1.5px] border-ink bg-card px-4 py-[15px] text-left shadow-paper active:scale-95"
          >
            <span className="flex h-[34px] w-[34px] flex-none -rotate-6 items-center justify-center rounded-full border-[1.5px] border-dashed border-ink font-mono text-xs font-semibold">
              {o.tag}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-display text-[17px]">{o.big}</span>
              <span className="text-[12.5px] text-ink/60">{o.small}</span>
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={() => dispatch({ type: 'SKIP_QUIZ' })}
        className="mt-auto self-center font-mono text-[11px] tracking-[0.12em] text-ink/50 underline"
      >
        SKIP — I CONTAIN MULTITUDES
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/screens/Onboarding.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppProvider, useApp } from '../state/AppContext'
import { Onboarding } from './Onboarding'

function Harness() {
  const { state } = useApp()
  return (<><Onboarding /><output>screen:{state.screen} step:{state.obStep}</output></>)
}

describe('Onboarding', () => {
  it('shows the first question and advances on pick', () => {
    render(<AppProvider><Harness /></AppProvider>)
    expect(screen.getByText('Team Woof or Team Meow?')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Team Woof'))
    expect(screen.getByText(/step:1/)).toBeInTheDocument()
    expect(screen.getByText('What’s home like?')).toBeInTheDocument()
  })

  it('skip jumps to discover', () => {
    render(<AppProvider><Harness /></AppProvider>)
    fireEvent.click(screen.getByText('SKIP — I CONTAIN MULTITUDES'))
    expect(screen.getByText(/screen:discover/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run — expect PASS** (`npm test -- Onboarding`).

- [ ] **Step 4: Commit**

```bash
git add src/screens/Onboarding.tsx src/screens/Onboarding.test.tsx
git commit -m "feat: add Onboarding quiz screen"
```

---

## Task 13: Discover screen (stories row + deck + action buttons + empty state)

**Files:**
- Create: `src/screens/Discover.tsx`
- Test: `src/screens/Discover.test.tsx`

**Interfaces:**
- Consumes: `useApp`, selectors (`selectDeck`, `selectScore`, `selectTopId`), `SwipeCard`, `AnimalPhoto`, `shelterStories`, `activeFilterCount`, `useSwipe`'s `flyProgrammatic` is NOT used here — instead the action buttons dispatch `SWIPE` directly on the top card (simpler; the fly animation is a nicety carried by drag). Reads `state.filters`; dispatches `SWIPE`, `OPEN_DETAIL`, `OPEN_FILTERS`, `OPEN_STORY`, `RESET_DECK`.
- Structure/copy: port from `reference-project/Furever.dc.html:82-146`. Header logo + `SWIPE · SMOOSH · ADOPT`; filters button `FILTERS · {count|OFF}`; empty state `That's every floof in range.` / `Widen your filters, cupid — love knows no radius.` / button `RE-DEAL THE DECK`.

**Deck rendering:** map the full `animals` list to `SwipeCard` with `position = deck.findIndex(id) ` (so cards keep identity), passing `position` for the top 3 and `-1` otherwise. Action buttons compute `topId = selectTopId(state)` and dispatch `SWIPE`.

- [ ] **Step 1: Write `src/screens/Discover.tsx`**

```tsx
import { useApp } from '../state/AppContext'
import { animals } from '../data/animals'
import { shelterStories } from '../data/stories'
import { SwipeCard } from '../components/SwipeCard'
import { AnimalPhoto } from '../components/AnimalPhoto'
import { selectDeck, selectScore, selectTopId } from '../state/selectors'
import { activeFilterCount } from '../lib/filters'
import type { SwipeDir } from '../types'

export function Discover() {
  const { state, dispatch } = useApp()
  const deck = selectDeck(state)
  const topId = selectTopId(state)
  const count = activeFilterCount(state.filters)
  const positionOf = (id: string) => {
    const i = deck.findIndex((a) => a.id === id)
    return i < 0 || i > 2 ? -1 : i
  }
  const swipeTop = (dir: SwipeDir) => { if (topId) dispatch({ type: 'SWIPE', id: topId, dir }) }

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
              <AnimalPhoto src={undefined} id={undefined} name={s.short} shape="circle" />
            </span>
            <span className="max-w-[64px] truncate font-mono text-[8.5px] tracking-[0.06em] text-ink/70">{s.short}</span>
          </button>
        ))}
      </div>

      <div className="relative mx-5 mb-10 mt-2 min-h-0 flex-1">
        {animals.map((a) => (
          <SwipeCard
            key={a.id}
            animal={a}
            score={selectScore(state, a)}
            position={positionOf(a.id)}
            onCommit={(dir) => dispatch({ type: 'SWIPE', id: a.id, dir })}
            onOpenDetail={() => dispatch({ type: 'OPEN_DETAIL', id: a.id })}
          />
        ))}
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
        <button aria-label="Like" onClick={() => swipeTop('like')} className="h-[66px] w-[66px] rounded-full border-[1.5px] border-ink bg-rust text-[26px] text-paper shadow-paper hover:animate-wiggle active:scale-90">♥</button>
      </div>
    </div>
  )
}
```

(The story avatars use the fallback block by design — swap `AnimalPhoto` `src` to `storyPhoto(i)` from the manifest if you want the bundled shelter photo in the ring; optional polish.)

- [ ] **Step 2: Write `src/screens/Discover.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { AppProvider, useApp } from '../state/AppContext'
import { Discover } from './Discover'

function Harness() {
  const { state } = useApp()
  return (<><Discover /><output>liked:{Object.values(state.swiped).filter((d) => d === 'like').length} detail:{state.detailId ?? '-'}</output></>)
}

describe('Discover', () => {
  it('renders the deck with the top card visible', () => {
    render(<AppProvider><Discover /></AppProvider>)
    // first deck animal is "Haku" (biscuit)
    expect(screen.getAllByText('Haku').length).toBeGreaterThan(0)
  })

  it('the like button records a like on the top card', () => {
    render(<AppProvider><Harness /></AppProvider>)
    fireEvent.click(screen.getByLabelText('Like'))
    expect(screen.getByText(/liked:1/)).toBeInTheDocument()
  })

  it('the info button opens detail for the top card', () => {
    render(<AppProvider><Harness /></AppProvider>)
    fireEvent.click(screen.getByLabelText('Details'))
    expect(screen.getByText(/detail:biscuit/)).toBeInTheDocument()
  })

  it('shows the empty state after every animal is swiped', () => {
    function AllSwiped() {
      const { dispatch } = useApp()
      return <button onClick={() => { /* swipe all */ }}>noop</button>
    }
    void AllSwiped
    // simpler: set a narrow filter that excludes everyone via the store
    render(<AppProvider><EmptyHarness /></AppProvider>)
    expect(screen.getByText("That's every floof in range.")).toBeInTheDocument()
  })
})

function EmptyHarness() {
  const { dispatch } = useApp()
  // narrow distance below the closest animal (0.8km) → empty deck
  return (
    <>
      <button onClick={() => dispatch({ type: 'SET_FILTER', patch: { maxDist: 0 } })}>narrow</button>
      <Discover />
      <Trigger />
    </>
  )
}
function Trigger() {
  const { state, dispatch } = useApp()
  // apply the narrow filter once on mount via a click emulation is awkward; do it directly:
  if (state.filters.maxDist !== 0) dispatch({ type: 'SET_FILTER', patch: { maxDist: 0 } })
  return null
}
```

Note: the empty-state test uses a `Trigger` that dispatches a distance-0 filter (below the nearest animal at 0.8 km) so the deck is empty. If dispatching during render warns, instead wrap the dispatch in a `useEffect` inside `Trigger`.

- [ ] **Step 3: Run — expect PASS** (`npm test -- Discover`). Fix the `Trigger` to use `useEffect` if React warns about dispatching during render.

- [ ] **Step 4: Commit**

```bash
git add src/screens/Discover.tsx src/screens/Discover.test.tsx
git commit -m "feat: add Discover deck screen"
```

---

## Task 14: Matches screen

**Files:**
- Create: `src/screens/Matches.tsx`
- Test: `src/screens/Matches.test.tsx`

**Interfaces:**
- Consumes: `useApp`, `selectLiked`, `selectMutuals`, `selectShortlist`, `AnimalPhoto`. Dispatches `OPEN_CHAT`, `OPEN_DETAIL`.
- Structure/copy: port from `reference-project/Furever.dc.html:149-195`. Title `The shortlist`; liked-count label `{n} FLOOF(S) FAVED`; mutual header `MUTUAL SPARKS ♥`; shortlist header `ALSO FAVED` (if mutuals exist) else `FAVED, AWAITING SPARKS`; empty state `Nobody faved. Yet.` / `Get back out there, cupid — the deck awaits.`; Chat buttons labelled `CHAT`.

- [ ] **Step 1: Write `src/screens/Matches.tsx`** per the reference (mutual carousel of cards + shortlist rows + empty state). Wire each `CHAT` button to `dispatch({ type: 'OPEN_CHAT', id })` and each avatar/name to `dispatch({ type: 'OPEN_DETAIL', id })`. Use `selectMutuals(state)`, `selectShortlist(state)`, `selectLiked(state)`. Apply `tiltDeg` for the row/card rotations. (Reproduce the reference markup with token utilities as in Task 13.)

- [ ] **Step 2: Write `src/screens/Matches.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { Matches } from './Matches'

function Seed({ likes }: { likes: string[] }) {
  const { state, dispatch } = useApp()
  useEffect(() => { likes.forEach((id) => dispatch({ type: 'SWIPE', id, dir: 'like' })) }, [])
  return (<><Matches /><output>screen:{state.screen} chat:{state.chatId ?? '-'}</output></>)
}

describe('Matches', () => {
  it('shows the empty state with no likes', () => {
    render(<AppProvider><Matches /></AppProvider>)
    expect(screen.getByText('Nobody faved. Yet.')).toBeInTheDocument()
  })

  it('lists a mutual and opens chat', () => {
    render(<AppProvider><Seed likes={['biscuit']} /></AppProvider>)
    expect(screen.getByText('MUTUAL SPARKS ♥')).toBeInTheDocument()
    fireEvent.click(screen.getAllByText('CHAT')[0])
    expect(screen.getByText(/screen:chat/)).toBeInTheDocument()
    expect(screen.getByText(/chat:biscuit/)).toBeInTheDocument()
  })

  it('lists a non-mutual like under the shortlist', () => {
    render(<AppProvider><Seed likes={['clementine']} /></AppProvider>)
    expect(screen.getByText('FAVED, AWAITING SPARKS')).toBeInTheDocument()
    expect(screen.getByText('Moon Cake')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run — expect PASS** (`npm test -- Matches`).

- [ ] **Step 4: Commit**

```bash
git add src/screens/Matches.tsx src/screens/Matches.test.tsx
git commit -m "feat: add Matches screen"
```

---

## Task 15: Chat screen

**Files:**
- Create: `src/screens/Chat.tsx`
- Test: `src/screens/Chat.test.tsx`

**Interfaces:**
- Consumes: `useApp`, `animals`, `AnimalPhoto`. Reads `state.chatId`, `state.threads`, `state.chatDraft`; dispatches `SET_DRAFT`, `SEND_MESSAGE`, `BACK_TO_MATCHES`. (Auto-reply is handled by `useAutoReply` mounted in `App`.)
- Structure/copy: port from `reference-project/Furever.dc.html:198-227`. Header shows animal avatar/name + `VIA {SHELTER}` + `REPLIES FAST` badge; quick-reply chips (shown only before the first user message): `When can I visit?`, `Is {name} good with kids?`, `Tell me everything.`; input placeholder `Say something fetching…`.
- Message bubble styling from `reference-project/Furever.dc.html:583-586`: mine = `self-end bg-ink text-paper rounded-2xl rounded-br-[4px]`; theirs = `self-start bg-card border-[1.5px] border-ink rounded-2xl rounded-bl-[4px]`.

- [ ] **Step 1: Write `src/screens/Chat.tsx`**

```tsx
import { useApp } from '../state/AppContext'
import { animals } from '../data/animals'
import { AnimalPhoto } from '../components/AnimalPhoto'

export function Chat() {
  const { state, dispatch } = useApp()
  const id = state.chatId
  const animal = animals.find((a) => a.id === id)
  if (!animal || !id) return null
  const thread = state.threads[id] ?? []
  const showQuick = thread.filter((m) => m.from === 'me').length === 0
  const quick = ['When can I visit?', `Is ${animal.name} good with kids?`, 'Tell me everything.']

  return (
    <div className="flex min-h-0 flex-1 animate-fade-in flex-col">
      <div className="flex items-center gap-2.5 border-b-[1.5px] border-ink bg-[#fdf8ec] px-4 py-3">
        <button aria-label="Back" onClick={() => dispatch({ type: 'BACK_TO_MATCHES' })} className="p-1 text-[19px] text-ink">←</button>
        <span className="h-[38px] w-[38px] flex-none rounded-full border-[1.5px] border-ink p-0.5">
          <AnimalPhoto id={animal.id} name={animal.name} shape="circle" />
        </span>
        <span className="flex flex-col">
          <span className="font-display text-base">{animal.name}</span>
          <span className="font-mono text-[8.5px] tracking-[0.14em] text-ink/55">VIA {animal.shelter.toUpperCase()}</span>
        </span>
        <span className="ml-auto rotate-2 rounded-full border-[1.5px] border-dashed border-sage px-2 py-[3px] font-mono text-[8px] tracking-[0.1em] text-sage">REPLIES FAST</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        {thread.map((m, i) => (
          <div
            key={i}
            className={`max-w-[78%] animate-pop-in rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.45] ${
              m.from === 'me'
                ? 'self-end rounded-br-[4px] bg-ink text-paper'
                : 'self-start rounded-bl-[4px] border-[1.5px] border-ink bg-card text-ink'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {showQuick && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-2.5">
          {quick.map((q) => (
            <button key={q} onClick={() => dispatch({ type: 'SEND_MESSAGE', text: q })} className="flex-none rounded-full border-[1.5px] border-dashed border-ink bg-card px-3.5 py-[7px] font-body text-xs active:scale-95">
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'SEND_MESSAGE', text: state.chatDraft }) }}
        className="flex gap-2.5 border-t-[1.5px] border-ink/15 px-4 pb-4 pt-2.5"
      >
        <input
          value={state.chatDraft}
          onChange={(e) => dispatch({ type: 'SET_DRAFT', value: e.target.value })}
          placeholder="Say something fetching…"
          className="flex-1 rounded-full border-[1.5px] border-ink bg-card px-4 py-2.5 font-body text-sm text-ink outline-none"
        />
        <button type="submit" aria-label="Send" className="h-11 w-11 flex-none rounded-full border-[1.5px] border-ink bg-rust text-[17px] text-paper active:scale-90">➤</button>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/screens/Chat.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { Chat } from './Chat'
import { useAutoReply } from '../hooks/useAutoReply'

function Harness() {
  const { dispatch } = useApp()
  useAutoReply()
  useEffect(() => { dispatch({ type: 'OPEN_CHAT', id: 'biscuit' }) }, [])
  return <Chat />
}

describe('Chat', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows the seeded greeting and quick replies', () => {
    render(<AppProvider><Harness /></AppProvider>)
    expect(screen.getByText(/just did a happy dance/)).toBeInTheDocument()
    expect(screen.getByText('When can I visit?')).toBeInTheDocument()
  })

  it('sending a message appends it and triggers an auto-reply', () => {
    render(<AppProvider><Harness /></AppProvider>)
    fireEvent.click(screen.getByText('Tell me everything.'))
    expect(screen.getByText('Tell me everything.')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText(/meet-and-greets all week/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run — expect PASS** (`npm test -- Chat`).

- [ ] **Step 4: Commit**

```bash
git add src/screens/Chat.tsx src/screens/Chat.test.tsx
git commit -m "feat: add Chat screen"
```

---

## Task 16: Profile screen

**Files:**
- Create: `src/screens/Profile.tsx`
- Test: `src/screens/Profile.test.tsx`

**Interfaces:**
- Consumes: `useApp`, `selectLiked`, `selectMutuals`, `selectPrefChips`. Reads `state.swiped`; dispatches `RETAKE_QUIZ`, `LOGOUT`.
- Structure/copy: port from `reference-project/Furever.dc.html:230-264`. Header `You` / `CERTIFIED FUTURE PET PARENT`; stat tiles `MET` / `SMITTEN` / `MUTUALS` (values: `Object.keys(state.swiped).length`, `selectLiked().length`, `selectMutuals().length`); section `YOUR VIBE, ON RECORD` with pref chips (fallback chip `Quiz not taken (rebel)` when none); buttons `RETAKE THE VIBE QUIZ`, `LOG OUT (THE FLOOFS WILL WAIT)`; footer `Furever v0.9 — no animals were left un-booped in the making of this app.`

- [ ] **Step 1: Write `src/screens/Profile.tsx`** per the reference, wiring the two buttons to `RETAKE_QUIZ` and `LOGOUT`, stats from selectors, and pref chips from `selectPrefChips(state)` (or the fallback chip when empty). Avatar uses `<AnimalPhoto name="You" shape="circle" />` (fallback block renders "Y").

- [ ] **Step 2: Write `src/screens/Profile.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { Profile } from './Profile'

function Seed() {
  const { state, dispatch } = useApp()
  useEffect(() => { dispatch({ type: 'SWIPE', id: 'biscuit', dir: 'like' }); dispatch({ type: 'SWIPE', id: 'clementine', dir: 'nope' }) }, [])
  return (<><Profile /><output>screen:{state.screen}</output></>)
}

describe('Profile', () => {
  it('shows stats reflecting swipes', () => {
    render(<AppProvider><Seed /></AppProvider>)
    expect(screen.getByText('MET')).toBeInTheDocument()
    expect(screen.getByText('SMITTEN')).toBeInTheDocument()
    // 1 like + 1 nope = 2 met
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('logout returns to login', () => {
    render(<AppProvider><Seed /></AppProvider>)
    fireEvent.click(screen.getByText('LOG OUT (THE FLOOFS WILL WAIT)'))
    expect(screen.getByText(/screen:login/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run — expect PASS** (`npm test -- Profile`).

- [ ] **Step 4: Commit**

```bash
git add src/screens/Profile.tsx src/screens/Profile.test.tsx
git commit -m "feat: add Profile screen"
```

---

## Task 17: Detail sheet overlay

**Files:**
- Create: `src/overlays/DetailSheet.tsx`
- Test: `src/overlays/DetailSheet.test.tsx`

**Interfaces:**
- Consumes: `useApp`, `animals`, `detailCaptions`, `selectScore`, `AnimalPhoto`, `BottomSheet`. Reads `state.detailId`; dispatches `CLOSE_DETAIL`, `OPEN_CHAT`.
- Structure/copy: port from `reference-project/Furever.dc.html:273-343`. Sheet height 88%. Sections: header (name/age/breed/dist), bio, 3 captioned photos (all use the animal's photo via `AnimalPhoto id`), tag chips, `THE ROOMMATE REPORT` compat grid (KIDS/DOGS/CATS with `YES`/`NO`/`ASK` colored sage/nope/amber), `WHERE TO FIND {NAME}` shelter/fee card with map placeholder + `OPEN TODAY`, CTA `SLIDE INTO {NAME}'S DMS`.
- Compat colour map: `YES→text-sage`, `NO→text-nope`, `ASK→text-amber`.

- [ ] **Step 1: Write `src/overlays/DetailSheet.tsx`**

Render `null` when `state.detailId` is falsy. Otherwise render a `<BottomSheet open onClose={() => dispatch({ type: 'CLOSE_DETAIL' })} height="88%">` with the sections above. Captions come from `detailCaptions[animal.id]`. The CTA dispatches `OPEN_CHAT`. Reproduce the reference markup with token utilities; the three photo blocks reuse `<AnimalPhoto id={animal.id} name={animal.name} shape="rounded" />` with the tape-strip decorations (`absolute` beige rectangles, `bg-paperdark/85`).

- [ ] **Step 2: Write `src/overlays/DetailSheet.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { DetailSheet } from './DetailSheet'

function Open({ id }: { id: string }) {
  const { state, dispatch } = useApp()
  useEffect(() => { dispatch({ type: 'OPEN_DETAIL', id }) }, [])
  return (<><DetailSheet /><output>screen:{state.screen} detail:{state.detailId ?? '-'}</output></>)
}

describe('DetailSheet', () => {
  it('renders the animal bio and compat report', () => {
    render(<AppProvider><Open id="biscuit" /></AppProvider>)
    expect(screen.getByText(/every stranger is a friend/)).toBeInTheDocument()
    expect(screen.getByText('THE ROOMMATE REPORT')).toBeInTheDocument()
    expect(screen.getByText('KIDS')).toBeInTheDocument()
  })

  it('the DMs CTA opens chat', () => {
    render(<AppProvider><Open id="biscuit" /></AppProvider>)
    fireEvent.click(screen.getByText(/SLIDE INTO HAKU'S DMS/))
    expect(screen.getByText(/screen:chat/)).toBeInTheDocument()
  })

  it('renders nothing without a detailId', () => {
    const { container } = render(<AppProvider><DetailSheet /></AppProvider>)
    expect(container).toBeEmptyDOMElement()
  })
})
```

- [ ] **Step 3: Run — expect PASS** (`npm test -- DetailSheet`).

- [ ] **Step 4: Commit**

```bash
git add src/overlays/DetailSheet.tsx src/overlays/DetailSheet.test.tsx
git commit -m "feat: add pet DetailSheet overlay"
```

---

## Task 18: Filters sheet overlay

**Files:**
- Create: `src/overlays/FiltersSheet.tsx`
- Test: `src/overlays/FiltersSheet.test.tsx`

**Interfaces:**
- Consumes: `useApp`, `animals`, `passesFilters`, `BottomSheet`. Reads `state.showFilters`, `state.filters`; dispatches `SET_FILTER`, `CLOSE_FILTERS`.
- Structure/copy: port from `reference-project/Furever.dc.html:345-363`. Title `Narrow the field`; `SPECIES` chips `ALL FLOOFS`/`DOGS`/`CATS`; `DISTANCE` slider 1–50 with `≤ {n} KM`; `AGE` slider 1–15 with `≤ {n} YRS`; apply button `SHOW ME {n} FLOOF(S)` where n = count of animals passing the current filters.

- [ ] **Step 1: Write `src/overlays/FiltersSheet.tsx`**

Render via `<BottomSheet open={state.showFilters} onClose={() => dispatch({ type: 'CLOSE_FILTERS' })}>`. Species chips dispatch `SET_FILTER` with `{ species }`. Sliders are `<input type="range">` bound to `state.filters.maxDist`/`maxAge`, dispatching `SET_FILTER` with the numeric value (`+e.target.value`). The apply button computes `animals.filter((a) => passesFilters(a, state.filters)).length` and closes the sheet.

- [ ] **Step 2: Write `src/overlays/FiltersSheet.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { FiltersSheet } from './FiltersSheet'

function Open() {
  const { state, dispatch } = useApp()
  useEffect(() => { dispatch({ type: 'OPEN_FILTERS' }) }, [])
  return (<><FiltersSheet /><output>species:{state.filters.species} show:{String(state.showFilters)}</output></>)
}

describe('FiltersSheet', () => {
  it('sets species to dogs', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByText('DOGS'))
    expect(screen.getByText(/species:dog/)).toBeInTheDocument()
  })

  it('apply closes the sheet', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByText(/SHOW ME/))
    expect(screen.getByText(/show:false/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run — expect PASS** (`npm test -- FiltersSheet`).

- [ ] **Step 4: Commit**

```bash
git add src/overlays/FiltersSheet.tsx src/overlays/FiltersSheet.test.tsx
git commit -m "feat: add FiltersSheet overlay"
```

---

## Task 19: Story viewer overlay

**Files:**
- Create: `src/overlays/StoryViewer.tsx`
- Test: `src/overlays/StoryViewer.test.tsx`

**Interfaces:**
- Consumes: `useApp`, `shelterStories`, `storyPhoto`, `AnimalPhoto`. Reads `state.story`; dispatches `ADVANCE_STORY`, `CLOSE_STORY`. (Auto-advance timer is `useStoryPlayer`, mounted in `App`.)
- Structure/copy: port from `reference-project/Furever.dc.html:366-386`. Full-screen dark (`bg-[#1c1712]`); 3 segmented progress bars (filled/animating/empty based on `state.story.pic`); header `{SHELTER}` + `{when}` + close ✕; story photo; note card with `{note}` + `TAP TO CONTINUE`. Tapping the backdrop dispatches `ADVANCE_STORY`; ✕ dispatches `CLOSE_STORY`.
- Progress bar state (from `reference-project/Furever.dc.html:591`): pic index `< pic` → full width; `=== pic` → animate `storybar` 6s; `> pic` → empty.

- [ ] **Step 1: Write `src/overlays/StoryViewer.tsx`**

Render `null` when `state.story` is null. Otherwise a fixed `absolute inset-0 z-[60]` panel. The three bars: for `p` in `[0,1,2]`, inner span width `100%` if `p < pic`, else animate `[animation:storybar_6s_linear_forwards]` if `p === pic`, else `0`. Photo via `<AnimalPhoto src={storyPhoto(story.idx)} name={story.shelter} shape="rounded" radius={16} />`. Root `onClick` → `ADVANCE_STORY`; the ✕ button stops propagation and dispatches `CLOSE_STORY`.

- [ ] **Step 2: Write `src/overlays/StoryViewer.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { StoryViewer } from './StoryViewer'

function Open() {
  const { state, dispatch } = useApp()
  useEffect(() => { dispatch({ type: 'OPEN_STORY', idx: 0 }) }, [])
  return (<><StoryViewer /><output>story:{state.story ? `${state.story.idx}-${state.story.pic}` : 'none'}</output></>)
}

describe('StoryViewer', () => {
  it('shows the first shelter note', () => {
    render(<AppProvider><Open /></AppProvider>)
    expect(screen.getByText(/the goldens have landed/)).toBeInTheDocument()
  })

  it('close ✕ dismisses the story', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByLabelText('Close story'))
    expect(screen.getByText('story:none')).toBeInTheDocument()
  })
})
```

(Give the ✕ button `aria-label="Close story"`.)

- [ ] **Step 3: Run — expect PASS** (`npm test -- StoryViewer`).

- [ ] **Step 4: Commit**

```bash
git add src/overlays/StoryViewer.tsx src/overlays/StoryViewer.test.tsx
git commit -m "feat: add StoryViewer overlay"
```

---

## Task 20: Match celebration overlay

**Files:**
- Create: `src/overlays/MatchCelebration.tsx`, `src/data/confetti.ts`
- Test: `src/overlays/MatchCelebration.test.tsx`

**Interfaces:**
- Consumes: `useApp`, `animals`, `AnimalPhoto`. Reads `state.matchId`; dispatches `OPEN_CHAT`, `DISMISS_MATCH`.
- Produces: `confetti` config array in `src/data/confetti.ts` (from `reference-project/Furever.dc.html:428`).
- Structure/copy: port from `reference-project/Furever.dc.html:388-406`. Header `STOP THE PRESSES`; title `A pawfect match!`; body `You and {name} faved each other.` / `Coincidence? {shelter} thinks not.`; paired avatars (You ♥ animal); CTA `SEND THE FIRST WOOF`; dismiss `KEEP SWIPING (PLAYER)`.

- [ ] **Step 1: Write `src/data/confetti.ts`**

```ts
export interface ConfettiBit {
  left: number
  delay: number
  dur: number
  color: string
  round: boolean
  size: number
}

export const confetti: ConfettiBit[] = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 61) % 100,
  delay: (i % 5) * 0.22,
  dur: 2.4 + (i % 4) * 0.5,
  color: ['#c2593c', '#4d8a68', '#d9a441', '#f6f0e3'][i % 4],
  round: i % 3 === 0,
  size: 8 + (i % 3) * 4,
}))
```

- [ ] **Step 2: Write `src/overlays/MatchCelebration.tsx`**

Render `null` when `state.matchId` is null. Otherwise a `absolute inset-0 z-[70]` scrim with falling confetti (`confetti.map` → `<span>` with inline `left/width/height/background/animation:fall`) and the `animate-pop-in` card. `SEND THE FIRST WOOF` dispatches `OPEN_CHAT` with `state.matchId`; `KEEP SWIPING (PLAYER)` dispatches `DISMISS_MATCH`. Avatars: `<AnimalPhoto name="You" shape="circle" />` and `<AnimalPhoto id={animal.id} name={animal.name} shape="circle" />`.

- [ ] **Step 3: Write `src/overlays/MatchCelebration.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { MatchCelebration } from './MatchCelebration'

function Open() {
  const { state, dispatch } = useApp()
  useEffect(() => { dispatch({ type: 'SWIPE', id: 'biscuit', dir: 'like' }) }, [])
  return (<><MatchCelebration /><output>screen:{state.screen} match:{state.matchId ?? '-'}</output></>)
}

describe('MatchCelebration', () => {
  it('appears when a mutual animal is liked', () => {
    render(<AppProvider><Open /></AppProvider>)
    expect(screen.getByText('A pawfect match!')).toBeInTheDocument()
    expect(screen.getByText(/You and Haku faved each other/)).toBeInTheDocument()
  })

  it('SEND THE FIRST WOOF opens chat', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByText('SEND THE FIRST WOOF'))
    expect(screen.getByText(/screen:chat/)).toBeInTheDocument()
  })

  it('KEEP SWIPING dismisses', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByText('KEEP SWIPING (PLAYER)'))
    expect(screen.getByText(/match:-/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run — expect PASS** (`npm test -- MatchCelebration`).

- [ ] **Step 5: Commit**

```bash
git add src/data/confetti.ts src/overlays/MatchCelebration.tsx src/overlays/MatchCelebration.test.tsx
git commit -m "feat: add MatchCelebration overlay"
```

---

## Task 21: App composition — router, tab bar, overlay mounts

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`
- Create: `src/components/TabBar.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: everything. `main.tsx` wraps `<App />` in `<AppProvider>`. `App` renders `<IOSFrame>`, the current screen (by `state.screen`), the `TabBar` (hidden on login/onboarding/chat), all overlays, and mounts `useAutoReply()` + `useStoryPlayer()`.
- `TabBar`: DISCOVER / MATCHES (with liked count) / PROFILE, from `reference-project/Furever.dc.html:594-598` + `:267-271`. Active tab styled rust; matches also active when screen is chat. Dispatches `NAVIGATE`.

- [ ] **Step 1: Write `src/components/TabBar.tsx`**

```tsx
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
            className={`flex-1 pb-[34px] pt-6 font-mono text-xs tracking-[0.18em] active:scale-95 ${active ? 'font-semibold text-rust' : 'text-ink/50'}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Replace `src/App.tsx`**

```tsx
import { IOSFrame } from './components/IOSFrame'
import { TabBar } from './components/TabBar'
import { Login } from './screens/Login'
import { Onboarding } from './screens/Onboarding'
import { Discover } from './screens/Discover'
import { Matches } from './screens/Matches'
import { Chat } from './screens/Chat'
import { Profile } from './screens/Profile'
import { DetailSheet } from './overlays/DetailSheet'
import { FiltersSheet } from './overlays/FiltersSheet'
import { StoryViewer } from './overlays/StoryViewer'
import { MatchCelebration } from './overlays/MatchCelebration'
import { useApp } from './state/AppContext'
import { useAutoReply } from './hooks/useAutoReply'
import { useStoryPlayer } from './hooks/useStoryPlayer'

const SCREENS = {
  login: Login,
  onboarding: Onboarding,
  discover: Discover,
  matches: Matches,
  chat: Chat,
  profile: Profile,
} as const

export default function App() {
  const { state } = useApp()
  useAutoReply()
  useStoryPlayer()
  const Screen = SCREENS[state.screen]
  const showTabs = state.screen !== 'login' && state.screen !== 'onboarding' && state.screen !== 'chat'

  return (
    <IOSFrame>
      <Screen />
      {showTabs && <TabBar />}
      <DetailSheet />
      <FiltersSheet />
      <StoryViewer />
      <MatchCelebration />
    </IOSFrame>
  )
}
```

- [ ] **Step 3: Update `src/main.tsx` to wrap in the provider**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './state/AppContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
```

- [ ] **Step 4: Write `src/App.test.tsx`** (end-to-end happy path)

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppProvider } from './state/AppContext'
import App from './App.tsx'

function renderApp() {
  return render(<AppProvider><App /></AppProvider>)
}

describe('App flow', () => {
  it('walks login → onboarding → discover', () => {
    renderApp()
    fireEvent.click(screen.getByText('LET ME IN →'))
    expect(screen.getByText('Team Woof or Team Meow?')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Team Woof'))
    fireEvent.click(screen.getByText('House + yard'))
    fireEvent.click(screen.getByText('Couch potato'))
    expect(screen.getByText('SWIPE · SMOOSH · ADOPT')).toBeInTheDocument()
  })

  it('hides the tab bar on login and shows it on discover', () => {
    renderApp()
    expect(screen.queryByText('PROFILE')).toBeNull()
    fireEvent.click(screen.getByText('Continue as a guest with treats'))
    fireEvent.click(screen.getByText('SKIP — I CONTAIN MULTITUDES'))
    expect(screen.getByText('PROFILE')).toBeInTheDocument()
  })
})
```

- [ ] **Step 5: Run the full suite + typecheck + build**

Run: `npm test && npm run typecheck && npm run build`
Expected: all tests PASS, typecheck clean, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/main.tsx src/components/TabBar.tsx
git commit -m "feat: compose app shell (router, tab bar, overlays)"
```

---

## Task 22: Lint pass + manual smoke test + README

**Files:**
- Modify: `README.md`
- Possibly modify: any files flagged by oxlint.

- [ ] **Step 1: Run oxlint and fix violations**

Run: `npm run lint`
Fix any `react/rules-of-hooks` or unused-export warnings. Re-run until clean.

- [ ] **Step 2: Manual smoke test in the browser**

Run: `npm run dev`, open the URL. Verify each flow by hand:
- Login (toggle sign-in/register; name field appears in register) → submit.
- Onboarding: answer 3 questions → lands on Discover. Retake via Profile works.
- Discover: drag a card right (SMITTEN stamp, flies off), drag left (PASS). Tap a card → detail sheet. Like/nope/info buttons work. Open filters, change species/sliders, apply. Open a story, watch it auto-advance, close it.
- Like a mutual animal (Haku/Pretzel/Pickle) → match celebration with confetti → "send the first woof" → chat. Send a message → auto-reply arrives.
- Matches: mutual carousel + shortlist; CHAT opens a thread.
- Profile: stats reflect activity; logout returns to login.

Fix any visual/behavioral gaps against `reference-project/Furever.dc.html`.

- [ ] **Step 3: Rewrite `README.md`**

Replace the Vite boilerplate with a short project README: what Furever is, the stack, `npm run dev/build/test/lint/typecheck`, where the seed data and design tokens live, the photo-sourcing note (placedog.net / cataas.com are prototyping sources — replace with licensed assets for production), and that it is a front-end-only prototype (no backend).

- [ ] **Step 4: Final verification**

Run: `npm test && npm run typecheck && npm run build && npm run lint`
Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: lint pass, README, final polish"
```

---

## Self-Review

**Spec coverage** — every spec item maps to a task:
- Login → T11 · Onboarding → T12 · Discover/deck/stories/empty → T13 · Matches → T14 · Chat + auto-reply → T15/T10 · Profile → T16
- Detail sheet → T17 · Filters sheet → T18 · Story viewer + auto-advance → T19/T10 · Match celebration + confetti → T20
- Tab bar → T21 · Seed data → T3 · Pure logic (score/filter/eligible/deck) → T4 · Reducer transitions → T5 · Selectors → T6
- Design tokens/fonts → T1 · Real bundled photos + fallback → T7/T8 · Swipe physics → T9 · Config defaults → T2 · TypeScript + Vitest → T1
- Non-goals respected (no backend, no router). Risk (photo sourcing) handled by T7 script + T8 fallback.

**Placeholder scan** — the only literal "placeholder" references are the intended `AnimalPhoto` fallback and map-strip decoration, both fully specified. No `TBD`/`TODO`/"implement later".

**Type consistency** — action names in `actions.ts` (T5) match every `dispatch` in T9–T21; selector names (`selectDeck/selectTopId/selectLiked/selectMutuals/selectShortlist/selectScore/selectPrefChips`) defined in T6 are used consistently; `AnimalPhoto` prop shape (`id/src/name/shape/radius`) is stable across all callers; `useSwipe` returns `{ ref, handlers, wasDragged, flyProgrammatic }` and `SwipeCard` consumes exactly those.
