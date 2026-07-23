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
