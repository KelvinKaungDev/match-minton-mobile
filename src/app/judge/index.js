import { useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { api } from '../../services/apiClient.js'
import { colors } from '../../lib/theme.js'
import { Button, Card, Txt } from '../../components/ui.js'

// idle | loading | invalid | expired | error
async function lookupCode(code) {
  let court
  try {
    court = await api.get(`/api/competition-courts/code/${code}`)
  } catch {
    return 'invalid'
  }

  try {
    const session = await api.get(`/api/competition-sessions/${court.sessionId}`)
    return session.status === 'finished' ? 'expired' : 'valid'
  } catch {
    return 'expired'
  }
}

const clean = (s) => s.toUpperCase().replace(/[^A-Z0-9]/g, '')

export default function JudgeEntry() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('idle')
  const inputRef = useRef(null)

  const handleChange = (raw) => {
    setCode(clean(raw).slice(0, 4))
    setStatus('idle')
  }

  const handleSubmit = async () => {
    if (code.length < 4) return
    setStatus('loading')
    try {
      const result = await lookupCode(code)
      if (result === 'valid') {
        setStatus('idle')
        router.push(`/judge/${code}`)
      } else {
        setStatus(result)
        setCode('')
        inputRef.current?.focus()
      }
    } catch {
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'
  const hasError = status !== 'idle' && status !== 'loading'

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center', padding: 24 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} hitSlop={10} style={{ position: 'absolute', top: 12, left: 24 }}>
          <Txt style={{ color: colors.textMuted }}>← Back</Txt>
        </Pressable>

        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Txt style={{ fontSize: 22 }}>🏸</Txt>
          </View>
          <Txt style={{ fontSize: 20, fontWeight: '700', marginTop: 10 }}>Match Minton</Txt>
        </View>

        <Card style={{ borderWidth: 1, borderColor: colors.borderSoft, padding: 24, gap: 20, alignItems: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <Txt style={{ fontSize: 20, fontWeight: '700' }}>Enter Court Code</Txt>
            <Txt style={{ color: colors.textDim, marginTop: 4, textAlign: 'center' }}>Get the 4-character code from your organiser</Txt>
          </View>

          {/* One hidden input drives four display boxes: paste, autofill and backspace all just work */}
          <Pressable onPress={() => inputRef.current?.focus()} style={{ flexDirection: 'row', gap: 12 }}>
            {[0, 1, 2, 3].map(i => (
              <View
                key={i}
                style={{
                  width: 56, height: 64, borderRadius: 12, backgroundColor: colors.cardAlt, borderWidth: 1,
                  alignItems: 'center', justifyContent: 'center',
                  borderColor: hasError ? 'rgba(239,68,68,0.6)' : code[i] ? colors.accent : i === code.length ? colors.accent : colors.border,
                }}
              >
                <Txt style={{ fontSize: 26, fontWeight: '900' }}>{code[i] ?? ''}</Txt>
              </View>
            ))}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleChange}
              onSubmitEditing={handleSubmit}
              autoFocus
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!isLoading}
              returnKeyType="go"
              style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.02 }}
            />
          </Pressable>

          <View style={{ height: 20, justifyContent: 'center' }}>
            {status === 'invalid' && <Txt style={{ color: colors.red }}>Invalid code, try again</Txt>}
            {status === 'expired' && <Txt style={{ color: colors.amber }}>Session has ended</Txt>}
            {status === 'error' && <Txt style={{ color: colors.amber }}>Connection error</Txt>}
          </View>

          <Button
            label="Enter Court"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={code.length < 4}
            style={{ alignSelf: 'stretch' }}
          />
        </Card>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
