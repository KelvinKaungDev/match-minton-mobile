import { useState } from 'react'
import { View } from 'react-native'
import { useSubscription } from '../../hooks/useSubscription.js'
import { colors } from '../../lib/theme.js'
import { Button, Txt } from '../ui.js'

export default function ProGate({ children }) {
  const { isPro, upgradeToProFree } = useSubscription()
  const [upgrading, setUpgrading] = useState(false)
  const [message, setMessage] = useState('')

  if (isPro) return children

  const handleUpgrade = async () => {
    setUpgrading(true)
    setMessage('')
    try {
      await upgradeToProFree()
    } catch (err) {
      setMessage(err.message || 'Upgrade failed')
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <View style={{ borderRadius: 12, overflow: 'hidden' }}>
      {/* Preview of the locked content, dimmed and non-interactive */}
      <View pointerEvents="none" style={{ opacity: 0.25 }}>{children}</View>
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: 'rgba(12,10,9,0.75)' }}>
        <Txt style={{ fontSize: 32 }}>🔒</Txt>
        <Txt style={{ fontWeight: '600', letterSpacing: 0.5 }}>Pro Feature</Txt>
        {message ? <Txt style={{ color: colors.red, fontSize: 12 }}>{message}</Txt> : null}
        <Button
          label="Upgrade to Pro"
          onPress={handleUpgrade}
          loading={upgrading}
          style={{ paddingHorizontal: 24, paddingVertical: 10 }}
        />
      </View>
    </View>
  )
}
