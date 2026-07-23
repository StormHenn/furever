import { useApp } from '../state/AppContext'
import { quizSteps } from '../data/quiz'

export function Onboarding() {
  const { state, dispatch } = useApp()
  const step = quizSteps[Math.min(state.obStep, 2)]

  return (
    <div className="flex flex-1 animate-fade-in flex-col px-6 pb-[34px] pt-[26px]">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] font-semibold tracking-[0.22em]">FUREVER · VIBE CHECK</div>
        <div className="rotate-3 rounded-full border-[1.5px] border-dashed border-rust px-2 py-[3px] font-mono text-[10px] tracking-[0.15em] text-rust">
          {state.obStep + 1} / 3
        </div>
      </div>
      <h1 className="mb-2.5 mt-[34px] font-display text-[32px] leading-[1.12] [text-wrap:pretty]">{step.title}</h1>
      <p className="mb-[26px] text-[14.5px] leading-[1.5] text-ink/65">{step.sub}</p>
      <div className="flex flex-col gap-3">
        {step.options.map((o) => (
          <button
            key={o.tag}
            onClick={() => dispatch({ type: 'PICK_QUIZ_OPTION', key: step.key, value: o.value })}
            className="flex items-center gap-3.5 rounded-[14px] border-[1.5px] border-ink bg-card px-4 py-[15px] text-left shadow-paper active:scale-95"
          >
            <span className="flex h-[34px] w-[34px] flex-none -rotate-6 items-center justify-center rounded-full border-[1.5px] border-dashed border-ink font-mono text-xs font-semibold">
              {o.tag}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-display text-[17px]">{o.big}</span>
              <span className="text-[12.5px] text-ink/60">{o.small}</span>
            </span>
          </button>
        ))}
      </div>
      <button
        onClick={() => dispatch({ type: 'SKIP_QUIZ' })}
        className="mt-auto self-center font-mono text-[11px] tracking-[0.12em] text-ink/50 underline"
      >
        SKIP — I CONTAIN MULTITUDES
      </button>
    </div>
  )
}
