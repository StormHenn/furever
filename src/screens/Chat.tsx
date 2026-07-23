import { useApp } from '../state/AppContext'
import { animals } from '../data/animals'
import { AnimalPhoto } from '../components/AnimalPhoto'

export function Chat() {
  const { state, dispatch } = useApp()
  const id = state.chatId
  const animal = animals.find((a) => a.id === id)
  if (!animal || !id) return null
  const thread = state.threads[id] ?? []
  const showQuick = thread.filter((m) => m.from === 'me').length === 0
  const quick = ['When can I visit?', `Is ${animal.name} good with kids?`, 'Tell me everything.']

  return (
    <div className="flex min-h-0 flex-1 animate-fade-in flex-col">
      <div className="flex items-center gap-2.5 border-b-[1.5px] border-ink bg-[#fdf8ec] px-4 py-3">
        <button aria-label="Back" onClick={() => dispatch({ type: 'BACK_TO_MATCHES' })} className="p-1 text-[19px] text-ink">←</button>
        <span className="h-[38px] w-[38px] flex-none rounded-full border-[1.5px] border-ink p-0.5">
          <AnimalPhoto id={animal.id} name={animal.name} shape="circle" />
        </span>
        <span className="flex flex-col">
          <span className="font-display text-base">{animal.name}</span>
          <span className="font-mono text-[8.5px] tracking-[0.14em] text-ink/55">VIA {animal.shelter.toUpperCase()}</span>
        </span>
        <span className="ml-auto rotate-2 rounded-full border-[1.5px] border-dashed border-sage px-2 py-[3px] font-mono text-[8px] tracking-[0.1em] text-sage">REPLIES FAST</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        {thread.map((m, i) => (
          <div
            key={i}
            className={`max-w-[78%] animate-pop-in rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.45] ${
              m.from === 'me'
                ? 'self-end rounded-br-[4px] bg-ink text-paper'
                : 'self-start rounded-bl-[4px] border-[1.5px] border-ink bg-card text-ink'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {showQuick && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-2.5">
          {quick.map((q) => (
            <button key={q} onClick={() => dispatch({ type: 'SEND_MESSAGE', text: q })} className="flex-none rounded-full border-[1.5px] border-dashed border-ink bg-card px-3.5 py-[7px] font-body text-xs active:scale-95">
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'SEND_MESSAGE', text: state.chatDraft }) }}
        className="flex gap-2.5 border-t-[1.5px] border-ink/15 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-2.5"
      >
        <input
          value={state.chatDraft}
          onChange={(e) => dispatch({ type: 'SET_DRAFT', value: e.target.value })}
          placeholder="Say something fetching…"
          className="flex-1 rounded-full border-[1.5px] border-ink bg-card px-4 py-2.5 font-body text-sm text-ink outline-none"
        />
        <button type="submit" aria-label="Send" className="h-11 w-11 flex-none rounded-full border-[1.5px] border-ink bg-rust text-[17px] text-paper active:scale-90">➤</button>
      </form>
    </div>
  )
}
