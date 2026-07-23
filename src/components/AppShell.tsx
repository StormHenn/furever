import type { ReactNode } from 'react'

/**
 * Full-bleed mobile shell. On phones it fills the viewport edge to edge; on
 * wider screens it stays a centred phone-width column so the layout keeps the
 * proportions it was designed at.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full justify-center overflow-hidden bg-paperdark">
      <div className="relative flex h-full w-full max-w-[440px] flex-col overflow-hidden bg-paper bg-dots pt-[calc(env(safe-area-inset-top,0px)+10px)] text-ink">
        {children}
      </div>
    </div>
  )
}
