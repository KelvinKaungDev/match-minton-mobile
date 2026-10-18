import { ScrollView, View } from 'react-native'
import { STATUS, calcPlayerCost } from '../../models/index.js'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Button, Card, Txt } from '../ui.js'

export default function SummaryScreen({ state }) {
  const { t } = useLang()
  const { players, session, resetSession } = state

  const activePlayers = players.filter(p => p.status !== STATUS.WAITING)
  const maxRoundsPerPlayer = session?.config?.maxRoundsPerPlayer ?? 0
  const fullRoundPrice = session?.config?.fullRoundPrice ?? 0
  const roundsPlayed = session?.currentRound ?? 0
  const avgRounds = activePlayers.length > 0
    ? (activePlayers.reduce((s, p) => s + p.roundsPlayed, 0) / activePlayers.length).toFixed(1)
    : '0'
  const mvp = [...activePlayers].sort((a, b) => b.roundsPlayed - a.roundsPlayed)[0]
  const sorted = [...players].sort((a, b) => b.roundsPlayed - a.roundsPlayed)

  const totalCollect = fullRoundPrice > 0
    ? sorted.reduce((sum, p) => sum + calcPlayerCost(p.roundsPlayed, fullRoundPrice, maxRoundsPerPlayer), 0)
    : 0

  const stats = [
    { value: roundsPlayed, label: t.roundsPlayed },
    { value: players.length, label: t.totalPlayers },
    { value: avgRounds, label: t.avgRounds },
    { value: mvp?.name ?? '—', label: t.mvpLabel(mvp?.roundsPlayed ?? 0), accent: true },
  ]

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Txt style={{ color: colors.accent, fontWeight: '700', fontSize: 24 }}>{t.sessionSummary}</Txt>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {stats.map(({ value, label, accent }) => (
            <Card key={label} style={{ width: '47.5%', alignItems: 'center' }}>
              <Txt numberOfLines={1} style={{ fontWeight: '700', fontSize: 20, color: accent ? colors.accent : colors.text }}>{String(value)}</Txt>
              <Txt style={{ color: colors.textDim, fontSize: 12, marginTop: 4 }}>{label}</Txt>
            </Card>
          ))}
        </View>

        {fullRoundPrice > 0 && (
          <Card style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Txt style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.payment}</Txt>
              <Txt>
                <Txt style={{ color: colors.accent, fontWeight: '700', fontSize: 18 }}>{totalCollect.toLocaleString()}</Txt>
                <Txt style={{ color: colors.textDim, fontSize: 12 }}> {t.totalCollect}</Txt>
              </Txt>
            </View>
            {sorted.filter(p => p.roundsPlayed > 0).map(p => {
              const cost = calcPlayerCost(p.roundsPlayed, fullRoundPrice, maxRoundsPerPlayer)
              const isFullRound = p.roundsPlayed >= maxRoundsPerPlayer
              return (
                <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <Txt numberOfLines={1} style={{ flexShrink: 1 }}>{p.name}</Txt>
                    {p.status === STATUS.LEAVE && <Txt style={{ color: 'rgba(248,113,113,0.7)', fontSize: 12 }}>{t.leftEarly}</Txt>}
                    {!isFullRound && <Txt style={{ color: colors.textDim, fontSize: 12 }}>{t.rounds(p.roundsPlayed)}</Txt>}
                  </View>
                  <Txt style={{ fontWeight: '600', color: isFullRound ? colors.accent : '#d6d3d1' }}>{cost.toLocaleString()}</Txt>
                </View>
              )
            })}
          </Card>
        )}

        <Card style={{ gap: 12 }}>
          <Txt style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.allPlayers}</Txt>
          {sorted.map(p => (
            <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Txt numberOfLines={1} style={{ width: 110 }}>{p.name}</Txt>
              <View style={{ flex: 1, height: 6, backgroundColor: colors.cardAlt, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', backgroundColor: colors.accent, borderRadius: 3, width: `${maxRoundsPerPlayer ? Math.min(100, (p.roundsPlayed / maxRoundsPerPlayer) * 100) : 0}%` }} />
              </View>
              <Txt style={{ color: colors.textMuted, fontSize: 12, minWidth: 44, textAlign: 'right' }}>{t.rounds(p.roundsPlayed)}</Txt>
            </View>
          ))}
        </Card>
      </ScrollView>

      <View style={{ borderTopWidth: 1, borderTopColor: colors.borderSoft, padding: 12, backgroundColor: colors.bg }}>
        <Button label={t.newSession} onPress={resetSession} />
      </View>
    </View>
  )
}
