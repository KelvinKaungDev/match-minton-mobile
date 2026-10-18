import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../context/AuthContext.js'
import { useLang } from '../context/LangContext.js'
import { useAppState } from '../hooks/useAppState.js'
import { colors } from '../lib/theme.js'
import { Loading } from './ui.js'
import TopBar from './TopBar.js'
import SetupScreen from './setup/SetupScreen.js'
import SessionScreen from './session/SessionScreen.js'
import SummaryScreen from './summary/SummaryScreen.js'

export default function OrganizerApp() {
  const { user } = useAuth()
  const { t } = useLang()
  const state = useAppState(user.uid)

  if (state.loading) return <Loading label={t.loading} />

  const screen = state.session?.screen ?? 'setup'

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar />
      <View style={{ flex: 1 }}>
        {screen === 'setup' && <SetupScreen state={state} />}
        {screen === 'session' && <SessionScreen state={state} />}
        {screen === 'summary' && <SummaryScreen state={state} />}
      </View>
    </SafeAreaView>
  )
}
