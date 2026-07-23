import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useEffect } from 'react'
import { AppProvider, useApp } from '../state/AppContext'
import { StoryViewer } from './StoryViewer'

function Open() {
  const { state, dispatch } = useApp()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { dispatch({ type: 'OPEN_STORY', idx: 0 }) }, [])
  return (<><StoryViewer /><output>story:{state.story ? `${state.story.idx}-${state.story.pic}` : 'none'}</output></>)
}

describe('StoryViewer', () => {
  it('shows the first shelter note', () => {
    render(<AppProvider><Open /></AppProvider>)
    expect(screen.getByText(/the goldens have landed/)).toBeInTheDocument()
  })

  it('close ✕ dismisses the story', () => {
    render(<AppProvider><Open /></AppProvider>)
    fireEvent.click(screen.getByLabelText('Close story'))
    expect(screen.getByText('story:none')).toBeInTheDocument()
  })
})
