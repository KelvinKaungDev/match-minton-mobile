import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from '../context/AuthContext.js'
import { LangProvider } from '../context/LangContext.js'
import { colors } from '../lib/theme.js'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LangProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
        </LangProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
