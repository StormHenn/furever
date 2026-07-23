# Adoption-Day Stories — Design

**Date:** 2026-07-23
**Status:** Approved, ready for planning

## Goal

Turn the story-ring row on the Discover screen into a showcase for adoption
agencies. Each circle shows a mock agency logo (initials monogram). Tapping a
circle opens a tap-through deck of adoption-day "ads": recaps of past events the
agency has run, and promos for upcoming ones.

This is a demo/mock feature — no real data, no functional RSVP. All event
backdrops reuse existing pet photos; no new image assets are added.

## Current state

- `Discover.tsx:41–50` renders one circle per `shelterStories` entry. The circle
  is an `AnimalPhoto` with `src={undefined}`, so it shows only the shelter's
  first initial in a plain placeholder, inside a dashed-rust ring.
- Tapping dispatches `OPEN_STORY` → `StoryViewer` overlay shows one photo
  (`storyPhoto(idx)`) plus a one-line `note`.
- `StoryViewer.tsx` hard-codes a 3-segment progress bar (`[0,1,2]`).
- `lib/story.ts` `nextStory(pos, storyCount)` assumes exactly 3 pics per story
  (`pic < 2`).
- Three shelters exist, each with pets whose photos we can reuse:
  - Happy Tails Rescue → `haku`, `pretzel`
  - Whisker Haven → `moon-cake`, `miso`, `pickle`
  - Paws & Effect → `yuki`, `juniper`, `meatball`

## Design decisions (from brainstorming)

- **Logo style:** initials monogram on a tinted, hand-drawn badge.
- **Ring treatment:** uniform — no visual distinction between agencies with
  upcoming vs. past events. Past/future differs only in the ad content.
- **Ad content:** two layouts by event kind — an upcoming-event flyer and a
  past-event recap. Keep the existing tap-through story format.

## Data model

Extend `src/types.ts`:

```ts
export type AdoptionEventKind = 'upcoming' | 'recap'

export interface AdoptionEvent {
  kind: AdoptionEventKind
  photoId?: string          // reuse an existing pet id as the backdrop
  title?: string            // headline, defaults per kind
  // upcoming (flyer):
  day?: string              // "SAT · SEP 14"
  time?: string             // "10AM – 2PM"
  place?: string            // "Dolores Park, SF"
  pitch?: string            // "8 dogs + 5 cats looking for their humans"
  // recap:
  stat?: string             // "12 ADOPTED"
  crowd?: string            // "200 friends came out"
  thanks?: string           // "thank you, San Francisco 🧡"
}

export interface ShelterStory {
  id: string
  shelter: string
  short: string
  mono: string                        // "HT" monogram initials
  tint: 'rust' | 'sky' | 'moss'       // per-agency badge color
  events: AdoptionEvent[]             // ordered slides; 2 per agency
}
```

The `when` and `note` fields are removed from `ShelterStory`.

`src/data/stories.ts` gets rewritten so each of the three agencies has 2 slides.
Suggested mix (final copy chosen during implementation, in the app's playful
zine voice):

- **Happy Tails Rescue** (`mono: 'HT'`, `tint: 'rust'`)
  - upcoming flyer — Saturday adoption day, `photoId: 'haku'`
  - recap — last month's event, `stat: '14 ADOPTED'`, `photoId: 'pretzel'`
- **Whisker Haven** (`mono: 'WH'`, `tint: 'sky'`)
  - upcoming flyer — kitten open house, `photoId: 'moon-cake'`
  - recap — `stat`, `photoId: 'pickle'`
- **Paws & Effect** (`mono: 'PE'`, `tint: 'moss'`)
  - upcoming flyer — fee-waived fair, `photoId: 'yuki'`
  - recap — `photoId: 'meatball'`

Deck sizes are allowed to vary per agency (the advance logic must not assume a
fixed count), even though the initial data uses 2 each.

## Components & changes

### `AgencyEmblem` (new component, `src/components/AgencyEmblem.tsx`)

- Props: `mono: string`, `tint: 'rust' | 'sky' | 'moss'`, optional `className`.
- Renders the initials centered on a tinted badge, filling its container
  (the parent supplies size + the existing dashed ring).
- Styled to match the hand-drawn aesthetic (paper/ink palette, display font,
  slight character). `tint` maps to existing/added Tailwind color tokens.

### `Discover.tsx`

- Replace the placeholder `AnimalPhoto` inside the ring (line ~45) with
  `<AgencyEmblem mono={s.mono} tint={s.tint} />`.
- Ring treatment unchanged (dashed rust, uniform). Label still uses `s.short`.

### `StoryViewer.tsx`

- Read the current agency via `shelterStories[idx]` and current slide via
  `story.events[pic]`.
- **Progress bar:** render `story.events.length` segments (not hard-coded 3).
  Fill rule unchanged (filled for `p < pic`, animating for `p === pic`).
- **Header:** show a small `AgencyEmblem` (or monogram) + agency name.
- **Slide body — two layouts by `slide.kind`:**
  - `upcoming` → flyer: pet photo backdrop, "ADOPTION DAY" (or `title`) header,
    `day` / `time` / `place`, the `pitch` line, and a decorative "RSVP →"
    button. The button is visual only: it `stopPropagation`s so it doesn't
    advance, but performs no navigation.
  - `recap` → recap: pet photo, a large `stat` headline, `crowd` line, and the
    `thanks` note, framed as a past highlight ("THAT WAS FUN" / date caption).
- Backdrop photo resolves via `petPhoto(slide.photoId)`; falls back gracefully
  when absent (AnimalPhoto already handles undefined).
- Tapping the backdrop still dispatches `ADVANCE_STORY`; close button unchanged.

### `lib/story.ts`

- `nextStory` must advance within a variable-length deck and roll to the next
  agency at the end. New signature:

  ```ts
  nextStory(pos: StoryPos, picCount: number, storyCount: number): StoryPos | null
  ```

  - `if (pos.pic < picCount - 1) return { idx, pic: pos.pic + 1 }`
  - `if (pos.idx + 1 < storyCount) return { idx: pos.idx + 1, pic: 0 }`
  - else `null`.

### `reducer.ts`

- `ADVANCE_STORY` passes the current agency's slide count:

  ```ts
  const cur = shelterStories[state.story.idx]
  nextStory(state.story, cur.events.length, shelterStories.length)
  ```

### `assets/pets/index.ts`

- `storyPhoto` and the `story0..2` imports become unused once backdrops move to
  `petPhoto(photoId)`. Remove them (and the now-orphaned `story-*.jpg` imports)
  if nothing else references them; otherwise leave a note. Confirm during
  implementation with a usage grep.

## Testing

Update existing tests and add new ones (TDD):

- `AgencyEmblem.test.tsx` (new): renders the monogram; applies the tint.
- `Discover.test.tsx`: circles render the monogram (not a bare shelter initial);
  tapping still dispatches `OPEN_STORY`.
- `StoryViewer.test.tsx`:
  - progress bar segment count equals the current agency's `events.length`;
  - an `upcoming` slide renders the flyer (day/time/place, RSVP button);
  - a `recap` slide renders the stat + thanks;
  - the RSVP button does not advance the story (click doesn't change slide).
- `lib/story` test (in the appropriate existing test file, or new): `nextStory`
  advances within a 2-slide deck and rolls over to the next agency; returns
  `null` at the very end. Cover decks of differing lengths.
- Reducer test: `ADVANCE_STORY` uses the current agency's slide count.

## Out of scope

- Real RSVP / calendar / sharing behavior.
- Agency-authored content, editing, or persistence.
- New image assets or per-slide distinct photos beyond reusing pet photos.
- Any past/upcoming distinction on the ring itself.
