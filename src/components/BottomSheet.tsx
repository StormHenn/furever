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
