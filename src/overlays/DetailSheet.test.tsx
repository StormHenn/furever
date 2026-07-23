import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { DetailSheet } from './DetailSheet'

function Open({ id }: { id: string }) {
  const { state, dispatch } = useApp()
  useEffect(() => { dispatch({ type: 'OPEN_DETAIL', id }) }, [])
  return (<><DetailSheet /><output>screen:{state.screen} detail:{state.detailId ?? '-'}</output></>)
}

describe('DetailSheet', () => {
  it('renders the animal bio and compat report', () => {
    render(<AppProvider><Open id="biscuit" /></AppProvider>)
    expect(screen.getByText(/every stranger is a friend/)).toBeInTheDocument()
    expect(screen.getByText('THE ROOMMATE REPORT')).toBeInTheDocument()
    expect(screen.getByText('KIDS')).toBeInTheDocument()
  })

  it('the DMs CTA opens chat', () => {
    render(<AppProvider><Open id="biscuit" /></AppProvider>)
    fireEvent.click(screen.getByText(/SLIDE INTO HAKU'S DMS/))
    expect(screen.getByText(/screen:chat/)).toBeInTheDocument()
  })

  it('renders nothing without a detailId', () => {
    const { container } = render(<AppProvider><DetailSheet /></AppProvider>)
    expect(container).toBeEmptyDOMElement()
  })
})
