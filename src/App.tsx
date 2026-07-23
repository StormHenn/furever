import { IOSFrame } from './components/IOSFrame'
import { TabBar } from './components/TabBar'
import { Login } from './screens/Login'
import { Onboarding } from './screens/Onboarding'
import { Discover } from './screens/Discover'
import { Matches } from './screens/Matches'
import { Chat } from './screens/Chat'
import { Profile } from './screens/Profile'
import { DetailSheet } from './overlays/DetailSheet'
import { FiltersSheet } from './overlays/FiltersSheet'
import { StoryViewer } from './overlays/StoryViewer'
import { MatchCelebration } from './overlays/MatchCelebration'
import { useApp } from './state/AppContext'
import { useAutoReply } from './hooks/useAutoReply'

const SCREENS = {
  login: Login,
  onboarding: Onboarding,
  discover: Discover,
  matches: Matches,
  chat: Chat,
  profile: Profile,
} as const

export default function App() {
  const { state } = useApp()
  useAutoReply()
  const Screen = SCREENS[state.screen]
  const showTabs = state.screen !== 'login' && state.screen !== 'onboarding' && state.screen !== 'chat'

  return (
    <IOSFrame>
      <Screen />
      {showTabs && <TabBar />}
      <DetailSheet />
      <FiltersSheet />
      <StoryViewer />
      <MatchCelebration />
    </IOSFrame>
  )
}
