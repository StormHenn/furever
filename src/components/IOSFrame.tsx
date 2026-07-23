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
