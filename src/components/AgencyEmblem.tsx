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
