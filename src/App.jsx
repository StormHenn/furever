import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 bg-slate-50 text-slate-900">
      <h1 className="text-5xl font-bold tracking-tight">
        🐾 Furever
      </h1>
      <p className="text-slate-500">
        React + Vite + Tailwind is up and running.
      </p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-500 active:scale-95"
      >
        Count is {count}
      </button>
      <p className="text-sm text-slate-400">
        Edit <code className="rounded bg-slate-200 px-1.5 py-0.5">src/App.jsx</code> and save to test HMR.
      </p>
    </div>
  )
}

export default App
