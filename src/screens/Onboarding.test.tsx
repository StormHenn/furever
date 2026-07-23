import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppProvider, useApp } from '../state/AppContext'
import { Onboarding } from './Onboarding'

function Harness() {
  const { state } = useApp()
  return (<><Onboarding /><output>screen:{state.screen} step:{state.obStep}</output></>)
}

describe('Onboarding', () => {
  it('shows the first question and advances on pick', () => {
    render(<AppProvider><Harness /></AppProvider>)
    expect(screen.getByText('Team Woof or Team Meow?')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Team Woof'))
    expect(screen.getByText(/step:1/)).toBeInTheDocument()
    expect(screen.getByText(/What['’]s home like\?/)).toBeInTheDocument()
  })

  it('skip jumps to discover', () => {
    render(<AppProvider><Harness /></AppProvider>)
    fireEvent.click(screen.getByText('SKIP — I CONTAIN MULTITUDES'))
    expect(screen.getByText(/screen:discover/)).toBeInTheDocument()
  })
})
