# Furever — Rebuild Design

**Date:** 2026-07-23
**Status:** Approved (design), pending implementation plan

## Summary

Rebuild the `reference-project/Furever.dc.html` prototype — a "Tinder for animal
adoption" mobile app — as a production-quality React + TypeScript + Tailwind v4 +
Vite application. The reference is authored in a proprietary design-comp framework
(`DCLogic` class with custom `<sc-if>` / `<sc-for>` / `<image-slot>` tags) as a
single 670-line component. We reproduce its full behavior and distinctive visual
design while restructuring it into clean, testable, well-bounded modules.

## Decisions (locked)

- **Scope:** Full fidelity — every screen and overlay in the reference.
- **Images:** Real, license-clean (CC0/public-domain) pet photos bundled under
  `src/assets/`, with an on-brand fallback placeholder.
- **Language:** TypeScript (migrate the JSX scaffold to `.tsx`).
- **Config knobs:** Hardcode sensible defaults (`startScreen=login`,
  `matchMode=destiny`, `tilt=on`). The three design-tool props are collapsed into a
  constants module, not a runtime config surface.

## Feature inventory (from the reference)

### Screens
1. **Login** — sign-in / register tab toggle; name (register only), email, password
   inputs; primary CTA; "continue as guest" button. Submitting → onboarding.
2. **Onboarding quiz** — 3-step "vibe check": species (dog/cat/both), home
   (apartment/yard/farm), energy (chill/medium/high). Progress indicator (`n / 3`),
   skip link. Answers stored in `prefs`; completing → discover.
3. **Discover** — swipeable Tinder card deck with drag physics; shelter stories row;
   filters button (shows active-filter count); like / nope / info action buttons;
   per-card match-% badge; `SMITTEN` / `PASS` drag stamps; empty-deck state with
   re-deal button.
4. **Matches** — "Mutual sparks" carousel (mutually-matched animals) + shortlist
   rows (faved, awaiting sparks); each has a Chat button; empty state.
5. **Chat** — message thread with the shelter; simulated auto-reply (~900ms);
   quick-reply chips (shown before first user message); text input + send.
6. **Profile** — avatar; stats (met / smitten / mutuals); preference chips from the
   quiz; retake-quiz and logout actions.

### Overlays (z-stacked over screens)
- **Detail sheet** — bottom sheet (88% height, slide-up): name/age/breed/distance,
  bio, 3 captioned photos, "roommate report" compat grid (kids/dogs/cats:
  YES/NO/ASK, color-coded), shelter + map placeholder + fee, "slide into DMs" CTA.
- **Filters sheet** — bottom sheet: species chips, distance slider (1–50 km), age
  slider (1–15 yrs), apply button showing filtered count.
- **Story viewer** — full-screen, auto-advancing (6s per pic, 3 pics per story, then
  next story); segmented progress bars; tap to advance; shelter name + timestamp +
  note card.
- **Match celebration** — full-screen modal with falling confetti, pop-in card,
  paired avatars, "send the first woof" (→ chat) / "keep swiping" actions.

### Bottom tab bar
Discover / Matches (with liked count badge) / Profile. Hidden on login,
onboarding, and chat screens.

### Seed data
- 8 animals (id, name, species, breed, age, dist, shelter, fee, base score, mutual
  flag, personality tags, kids/dogs/cats compat, bio) — carried over verbatim.
- 3 shelter stories (id, shelter, short name, timestamp, note).
- Confetti config (16 bits: position, delay, duration, color, shape, size).
- Per-animal detail-photo captions (`capsMap`).
- Onboarding quiz steps and preference-label map.

### Core logic (carried over, extracted to pure functions)
- `passesFilters(animal, filters)` — species + max distance + max age.
- `remainingDeck(animals, swiped, filters)` — unswiped ∩ passes.
- `scoreFor(animal, prefs)` — base score + 8 if prefs.species matches (cap 99).
- `isMatchEligible(animal, mode)` — `every-like` → always; `destiny` → `mutual`
  flag; `never` → false.
- Swipe commit → records direction; a `like` on an eligible animal triggers the
  match celebration.
- Chat auto-reply picks from a per-animal reply list indexed by message count.
- Story auto-advance state machine.

## Architecture

Three layers, dependency-free (no Zustand/Redux):

1. **Domain** — `types.ts`, `data/*`, and pure `lib/*` functions. No React.
2. **Store** — one `useReducer` behind `AppProvider` + `useApp()` hook. A single
   typed discriminated-union action type. The reducer is pure and unit-tested.
   Chosen over a state library because the state graph is bounded and this keeps the
   dependency surface minimal.
3. **Effects** — timers and imperative DOM (drag transform, auto-reply, story
   timer) isolated in focused hooks: `useSwipe`, `useAutoReply`, `useStoryPlayer`.

### State shape (reducer)

```
{
  screen: Screen                     // 'login'|'onboarding'|'discover'|'matches'|'chat'|'profile'
  loginMode: 'signin' | 'register'
  login: { name, email, pass }
  obStep: number                     // 0..2
  prefs: Partial<Record<PrefKey, string>>
  swiped: Record<AnimalId, 'like' | 'nope'>
  filters: { species, maxDist, maxAge }
  detailId: AnimalId | null
  showFilters: boolean
  matchId: AnimalId | null           // drives celebration
  story: { idx, pic } | null
  chatId: AnimalId | null
  threads: Record<AnimalId, Message[]>
  chatDraft: string
}
```

## File structure

```
src/
  main.tsx                 entry (StrictMode + AppProvider)
  App.tsx                  screen router + bottom tab bar + overlay mount points
  index.css                Tailwind import + @theme tokens + keyframes/utilities
  types.ts                 domain models
  config.ts                START_SCREEN, MATCH_MODE, TILT
  data/
    animals.ts             8 seeded animals + detail captions
    stories.ts             3 shelter stories
    quiz.ts                onboarding steps + preference-label map
  lib/
    matching.ts            scoreFor, isMatchEligible, remainingDeck
    filters.ts             passesFilters, activeFilterCount
  state/
    actions.ts             Action union
    reducer.ts             pure reducer + initialState
    AppContext.tsx         AppProvider + useApp()
  hooks/
    useSwipe.ts            pointer drag physics for the top card
    useStoryPlayer.ts      story auto-advance timer
    useAutoReply.ts        simulated shelter reply
  components/
    IOSFrame.tsx           presentational device shell (notch, status bar)
    BottomSheet.tsx        reusable slide-up sheet + scrim
    Chip.tsx               dashed/solid pill
    Stamp.tsx              SMITTEN / PASS drag stamp
    AnimalPhoto.tsx        bundled photo + fallback
    SwipeCard.tsx          single deck card (uses useSwipe when top)
  screens/
    Login.tsx  Onboarding.tsx  Discover.tsx  Matches.tsx  Chat.tsx  Profile.tsx
  overlays/
    DetailSheet.tsx  FiltersSheet.tsx  StoryViewer.tsx  MatchCelebration.tsx
  assets/
    pets/                  bundled CC0 pet photos
```

## Design system

Tailwind v4 with tokens in `index.css` via `@theme` (real tokens, not scattered
literals):

- **Colors:** `--color-paper #f6f0e3`, `--color-card #fffdf6`, `--color-ink #2a2118`,
  `--color-rust #c2593c`, `--color-sage #4d8a68`, `--color-amber #b8860b`.
- **Shadow:** `--shadow-paper: 3px 4px 0 rgba(42,33,24,.14)` → `shadow-paper`.
- **Fonts (bundled, offline):** `@fontsource/young-serif` (display),
  `@fontsource/karla` (body), `@fontsource/ibm-plex-mono` (labels). No Google CDN.
- **Keyframes:** `slideUp`, `popIn`, `fadeIn`, `fall`, `storybar`, `wiggle`.
- **Textures:** dotted-paper radial-gradient background utility.
- **Tilt:** small rotation utilities gated on the `TILT` constant.

## Swipe physics (`useSwipe`)

- On pointer-down on the top card: capture pointer, record start coords, disable
  transition.
- On move: apply `translate + rotate` transform imperatively via ref (no per-move
  React render); update `SMITTEN`/`PASS` stamp opacity from horizontal distance.
- On up: past ±110px threshold → fly the card off-screen then dispatch `SWIPE`;
  otherwise spring back.
- A tiny drag distance is treated as a tap → open detail (guards against
  accidental opens mid-drag).
- Action buttons (✕ / ♥ / i) drive the same fly/commit path programmatically.

## Images (`AnimalPhoto`)

- Real photos live in `src/assets/pets/`, imported so Vite fingerprints them.
- Each animal maps to a primary photo; the detail view's three photo slots reuse
  the primary (captions differ).
- Sourcing: license-clean CC0 / public-domain dog & cat photos, committed to the
  repo (honors the offline / no-external-call decision).
- Fallback: if a mapping is missing, render an on-brand placeholder (paper
  gradient + emoji/initial) so nothing breaks.

## Testing

Add **Vitest + React Testing Library** (scaffold currently has none):

- **Pure logic (TDD):** `scoreFor` boost + cap; `isMatchEligible` across all three
  modes; `passesFilters` narrowing; `remainingDeck` composition; `activeFilterCount`.
- **Reducer transitions:** swipe records direction; like on eligible animal sets
  `matchId`; navigation clears overlays; send-message appends then reply appends;
  retake-quiz resets prefs + obStep; logout resets auth.
- **A few component behaviors:** deck empty state renders re-deal; filters apply
  updates count; match celebration renders on eligible like.

## Non-goals

- No backend, real auth, real chat, or persistence (matches the prototype).
- No routing library — screen state is in the store (single-view app shell).
- The three design-tool config knobs are not exposed as a runtime UI.

## Risks

- **Photo sourcing** is the one external dependency. Mitigation: bundle CC0 assets;
  `AnimalPhoto` fallback guarantees the app renders even if a photo is absent.
