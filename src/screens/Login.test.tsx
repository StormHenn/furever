import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider, useApp } from '../state/AppContext'
import { Login } from './Login'

function Harness() {
  const { state } = useApp()
  return (
    <>
      <Login />
      <output>screen:{state.screen}</output>
    </>
  )
}

describe('Login', () => {
  it('hides the name field in signin mode and shows it in register mode', async () => {
    render(<AppProvider><Login /></AppProvider>)
    expect(screen.queryByPlaceholderText(/your name/i)).toBeNull()
    await userEvent.click(screen.getByText('REGISTER'))
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
  })

  it('submitting navigates to onboarding', () => {
    render(<AppProvider><Harness /></AppProvider>)
    fireEvent.click(screen.getByText('LET ME IN →'))
    expect(screen.getByText('screen:onboarding')).toBeInTheDocument()
  })
})
