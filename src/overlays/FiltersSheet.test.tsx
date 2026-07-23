import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { FiltersSheet } from './FiltersSheet'

function Open() {
  const { state, dispatch } = useApp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dispatch({ type: 'OPEN_FILTERS' }) }, [])
  return (<><FiltersSheet /><output>species:{state.filters.species} show:{String(state.showFilters)}</output></>)
}

describe('FiltersSheet', () => {
  it('sets species to dogs', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByText('DOGS'))
    expect(screen.getByText(/species:dog/)).toBeInTheDocument()
  })

  it('apply closes the sheet', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByText(/SHOW ME/))
    expect(screen.getByText(/show:false/)).toBeInTheDocument()
  })
})
