import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppProvider } from './state/AppContext'
import App from './App.tsx'

function renderApp() {
  return render(<AppProvider><App /></AppProvider>)
}

describe('App flow', () => {
  it('walks login → onboarding → discover', () => {
    renderApp()
    fireEvent.click(screen.getByText('LET ME IN →'))
    expect(screen.getByText('Team Woof or Team Meow?')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Team Woof'))
    fireEvent.click(screen.getByText('House + yard'))
    fireEvent.click(screen.getByText('Couch potato'))
    expect(screen.getByText('SWIPE · SMOOSH · ADOPT')).toBeInTheDocument()
  })

  it('hides the tab bar on login and shows it on discover', () => {
    renderApp()
    expect(screen.queryByText('PROFILE')).toBeNull()
    fireEvent.click(screen.getByText('Continue as a guest with treats'))
    fireEvent.click(screen.getByText('SKIP — I CONTAIN MULTITUDES'))
    expect(screen.getByText('PROFILE')).toBeInTheDocument()
  })
})
