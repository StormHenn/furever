# Furever

A "Tinder for pet adoption" prototype — swipe through adoptable dogs and cats, match on mutual likes, and chat with an auto-replying shelter bot. **Front-end only, no backend**: all state lives in memory for the session (login, onboarding answers, swipes, matches, and chat are not persisted anywhere).

## Stack

- React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Vite
- Vitest + React Testing Library

## Scripts

```bash
npm run dev          # start the dev server
npm run build        # production build to dist/
npm test             # run the test suite once
npm run test:watch   # run tests in watch mode
npm run lint         # oxlint
npm run typecheck    # tsc --noEmit
```

## Where things live

- `src/data/` — seed data: animals, quiz questions, shelter stories, confetti config.
- `src/index.css` — design tokens (colors, fonts, etc.) declared in the Tailwind v4 `@theme` block.
- `src/lib/` — pure logic: match scoring, filtering, swipe physics, chat auto-reply, story playback. No React, fully unit tested.
- `src/state/` — app state: reducer, action types, selectors, and the `AppContext` provider.
- `src/screens/` — the six top-level screens (Login, Onboarding, Discover, Matches, Chat, Profile).
- `src/overlays/` — modal/sheet overlays (Detail sheet, Filters sheet, Story viewer, Match celebration).
- `src/components/` — shared UI pieces (swipe card, tab bar, bottom sheet, animal photo, etc.).
- `src/assets/pets/` — bundled pet photos used by the app.
- `reference-project/` — the original static HTML/JS mockup this app was rebuilt from. Not part of the build.

## Photo sourcing

Pet photos bundled in `src/assets/pets/` were sourced from [placedog.net](https://placedog.net) and [cataas.com](https://cataas.com) for prototyping purposes only (see `scripts/fetch-pets.sh`). **Replace these with owned or properly licensed assets before shipping to production.**
