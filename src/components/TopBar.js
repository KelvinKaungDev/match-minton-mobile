import { Alert, Pressable, View } from 'react-native'
import { useAuth } from '../context/AuthContext.js'
import { useLang } from '../context/LangContext.js'
import { colors } from '../lib/theme.js'
import { Txt } from './ui.js'

function SmallButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} style={{ backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
      <Txt style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600' }}>{label}</Txt>
    </Pressable>
  )
}

export default function TopBar() {
  const { user, logout } = useAuth()
  const { lang, toggle } = useLang()

  const confirmLogout = () => {
    Alert.alert('Log out?', user?.email ?? '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ])
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 }}>
      <Txt style={{ color: colors.accent, fontWeight: '700', fontSize: 20 }}>Match Minton 🏸</Txt>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <SmallButton label={user?.email?.split('@')[0] ?? 'Account'} onPress={confirmLogout} />
        <SmallButton label={lang === 'th' ? 'EN' : 'TH'} onPress={toggle} />
      </View>
    </View>
  )
}
