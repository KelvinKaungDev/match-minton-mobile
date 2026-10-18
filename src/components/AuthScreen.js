import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../context/AuthContext.js'
import { colors } from '../lib/theme.js'
import { Button, Card, Field, Txt } from './ui.js'

export default function AuthScreen() {
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!isLogin && password !== confirm) return setError('Passwords do not match')
    if (password.length < 6) return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      if (isLogin) await login(email.trim(), password)
      else await signup(name.trim(), email.trim(), password)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(v => !v)
    setError('')
    setName('')
    setPassword('')
    setConfirm('')
  }

  const canSubmit = email.trim() && password && (isLogin || name.trim())

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Txt style={{ fontSize: 28 }}>🏸</Txt>
            </View>
            <Txt style={{ fontSize: 26, fontWeight: '700', marginTop: 12 }}>Match Minton</Txt>
            <Txt style={{ color: colors.textMuted, marginTop: 4, textAlign: 'center' }}>
              Fair court rotation for badminton clubs
            </Txt>
          </View>

          <Card style={{ borderWidth: 1, borderColor: colors.border, gap: 12 }}>
            <Txt style={{ fontSize: 18, fontWeight: '700' }}>{isLogin ? 'Log in' : 'Create account'}</Txt>

            {!isLogin && <Field value={name} onChangeText={setName} placeholder="Your name" autoComplete="name" />}
            <Field
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
            <Field value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry autoCapitalize="none" />
            {!isLogin && (
              <Field value={confirm} onChangeText={setConfirm} placeholder="Confirm password" secureTextEntry autoCapitalize="none" />
            )}

            {error ? <Txt style={{ color: colors.red, fontSize: 12 }}>{error}</Txt> : null}

            <Button
              label={isLogin ? 'Log in' : 'Create account'}
              onPress={handleSubmit}
              loading={loading}
              disabled={!canSubmit}
            />

            <Pressable onPress={switchMode} hitSlop={8}>
              <Txt style={{ color: colors.textDim, fontSize: 13, textAlign: 'center' }}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Txt style={{ color: colors.accent, fontWeight: '600', fontSize: 13 }}>{isLogin ? 'Sign up' : 'Log in'}</Txt>
              </Txt>
            </Pressable>
          </Card>

          <Button
            label="I'm a judge — enter a court code"
            variant="outline"
            onPress={() => router.push('/judge')}
            style={{ marginTop: 20 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
