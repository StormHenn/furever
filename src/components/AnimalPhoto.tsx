import type { CSSProperties } from 'react'
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
        draggable={false}
        // draggable only covers desktop drag; .no-callout handles the iOS
        // long-press peel. Belt and braces: the photo also stays out of hit
        // testing, so a touch lands on whatever card is holding it.
        style={{ ...style, pointerEvents: 'none' } as CSSProperties}
        className={`no-callout h-full w-full object-cover ${className}`}
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
