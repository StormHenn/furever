import { useApp } from '../state/AppContext'

export function Login() {
  const { state, dispatch } = useApp()
  const register = state.loginMode === 'register'
  const field = (f: 'name' | 'email' | 'pass') => (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: 'SET_LOGIN_FIELD', field: f, value: e.target.value })
  const inputCls =
    'rounded-[14px] border-[1.5px] border-ink bg-card px-4 py-[15px] font-body text-[14.5px] text-ink shadow-paper outline-none focus:border-rust'

  return (
    <div className="flex flex-1 animate-fade-in flex-col px-[26px] pb-10 pt-[30px]">
      <div className="mt-2.5 flex justify-center">
        <span className="-rotate-2 rounded-full border-[1.5px] border-dashed border-rust px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.22em] text-rust">
          EST. RIGHT MEOW
        </span>
      </div>
      <div className="my-6 text-center">
        <div className="-rotate-[1.5deg] font-display text-[46px]">furever<span className="text-rust">.</span></div>
        <div className="mt-2 text-[14.5px] text-ink/65">
          {register ? 'New here? The floofs have been expecting you.' : 'Welcome back. The floofs missed you.'}
        </div>
      </div>
      <div className="my-5 flex justify-center">
        <button
          onClick={() => dispatch({ type: 'SET_LOGIN_MODE', mode: 'signin' })}
          className={`rounded-l-full border-[1.5px] border-ink px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.16em] ${!register ? 'bg-ink text-paper' : 'bg-card text-ink/60'}`}
        >
          SIGN IN
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_LOGIN_MODE', mode: 'register' })}
          className={`rounded-r-full border-[1.5px] border-l-0 border-ink px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.16em] ${register ? 'bg-ink text-paper' : 'bg-card text-ink/60'}`}
        >
          REGISTER
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {register && (
          <input value={state.login.name} onChange={field('name')} placeholder="Your name (the pets will ask)" className={inputCls} />
        )}
        <input value={state.login.email} onChange={field('email')} placeholder="Email" className={inputCls} />
        <input value={state.login.pass} onChange={field('pass')} type="password" placeholder="Password (any old thing works)" className={inputCls} />
        <button
          onClick={() => dispatch({ type: 'SUBMIT_LOGIN' })}
          className="mt-1.5 rounded-[14px] border-[1.5px] border-ink bg-rust p-4 font-mono text-xs font-semibold tracking-[0.18em] text-paper shadow-paper active:scale-95"
        >
          {register ? 'MAKE IT OFFICIAL →' : 'LET ME IN →'}
        </button>
      </div>
      <div className="my-5 flex items-center gap-3">
        <span className="flex-1 border-t-[1.5px] border-dashed border-ink/30" />
        <span className="font-mono text-[9.5px] tracking-[0.18em] text-ink/50">OR</span>
        <span className="flex-1 border-t-[1.5px] border-dashed border-ink/30" />
      </div>
      <button
        onClick={() => dispatch({ type: 'SUBMIT_LOGIN' })}
        className="rounded-[14px] border-[1.5px] border-ink bg-card p-3.5 font-body text-sm font-bold text-ink shadow-paper active:scale-95"
      >
        Continue as a guest with treats
      </button>
      <div className="mt-auto text-center font-mono text-[9.5px] leading-[1.7] tracking-[0.14em] text-ink/45">
        NO REAL ACCOUNTS. NO SPAM.<br />JUST FLOOFS.
      </div>
    </div>
  )
}
