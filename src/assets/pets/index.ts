// Each pet's photos live in their own folder, named by the pet id:
//   src/assets/pets/haku/1.jpg, 2.jpg, 3.jpg
// To swap a pic for the mock, just replace a file in the pet's folder —
// no code changes needed. Files are ordered by filename (1, 2, 3, ...).
const files = import.meta.glob('./*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const petPhotos: Record<string, string[]> = {}
for (const path of Object.keys(files).sort()) {
  const folder = path.split('/')[1] // './haku/1.jpg' -> 'haku'
  ;(petPhotos[folder] ??= []).push(files[path])
}

/** A pet's photo at the given slot (defaults to the first). */
export function petPhoto(id: string, idx = 0): string | undefined {
  return petPhotos[id]?.[idx]
}

/** How many photos a pet has. */
export function petPhotoCount(id: string): number {
  return petPhotos[id]?.length ?? 0
}
