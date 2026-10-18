import { View } from 'react-native'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Card, Divider, Field, Stepper, Txt } from '../ui.js'

export default function SessionConfig({ config, onUpdate }) {
  const { t } = useLang()
  const { courts, maxRoundsPerPlayer, playersPerRound, maxPlayers = 36, fullRoundPrice = 0, courtNames = [] } = config
  const pricePerRound = maxRoundsPerPlayer > 0 && fullRoundPrice > 0
    ? Math.round(fullRoundPrice / maxRoundsPerPlayer)
    : 0

  const names = Array.from({ length: courts }, (_, i) => courtNames[i] ?? String(i + 1))

  const handleCourtsChange = (next) => {
    const nextNames = Array.from({ length: next }, (_, i) => courtNames[i] ?? String(i + 1))
    onUpdate(next, maxRoundsPerPlayer, maxPlayers, fullRoundPrice, nextNames)
  }

  const handleNameChange = (i, val) => {
    const nextNames = [...names]
    nextNames[i] = val
    onUpdate(courts, maxRoundsPerPlayer, maxPlayers, fullRoundPrice, nextNames)
  }

  return (
    <Card style={{ gap: 16 }}>
      <Txt style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.sessionConfig}</Txt>

      <Stepper label={t.courts} value={courts} min={1} max={15} onChange={handleCourtsChange} />

      <View style={{ gap: 6 }}>
        <Txt style={{ color: colors.textMuted, fontSize: 12 }}>{t.courtNames}</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {names.map((name, i) => (
            <Field
              key={i}
              value={name}
              onChangeText={v => handleNameChange(i, v)}
              maxLength={5}
              style={{ width: 52, textAlign: 'center', fontWeight: '700', paddingHorizontal: 4, paddingVertical: 8 }}
            />
          ))}
        </View>
      </View>

      <Stepper
        label={t.maxRounds}
        value={maxRoundsPerPlayer}
        min={1} max={20}
        onChange={v => onUpdate(courts, v, maxPlayers, fullRoundPrice, names)}
      />
      <Stepper
        label={t.maxPlayers}
        value={maxPlayers}
        min={4} max={200}
        onChange={v => onUpdate(courts, maxRoundsPerPlayer, v, fullRoundPrice, names)}
      />

      <Divider />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Txt style={{ color: colors.textMuted }}>{t.fullRoundPrice}</Txt>
        <Field
          keyboardType="number-pad"
          value={fullRoundPrice === 0 ? '' : String(fullRoundPrice)}
          placeholder="0"
          onChangeText={text => {
            const val = parseInt(text, 10)
            onUpdate(courts, maxRoundsPerPlayer, maxPlayers, isNaN(val) ? 0 : val, names)
          }}
          style={{ width: 100, textAlign: 'right', fontWeight: '700' }}
        />
      </View>
      {pricePerRound > 0 && (
        <Txt style={{ color: colors.textDim, fontSize: 12, textAlign: 'right', marginTop: -8 }}>
          {t.pricePerRound(pricePerRound)}
        </Txt>
      )}

      <Divider />
      <View style={{ alignItems: 'center' }}>
        <Txt style={{ color: colors.accent, fontWeight: '700', fontSize: 18 }}>{playersPerRound}</Txt>
        <Txt style={{ color: colors.textDim, fontSize: 12, marginTop: 2 }}>{t.playersPerMatch}</Txt>
      </View>
    </Card>
  )
}
