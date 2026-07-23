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
