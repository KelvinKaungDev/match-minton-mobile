import { View } from 'react-native'
import { calcPlayerCost, STATUS } from '../../models/index.js'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Chip, Divider, Empty, SkillBadge, Txt } from '../ui.js'

function Row({ player, cost, muted, action }) {
  const { t } = useLang()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: muted ? 'rgba(28,25,23,0.6)' : colors.card, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        <SkillBadge skill={player.skill} />
        <Txt numberOfLines={1} style={{ flexShrink: 1, color: muted ? colors.textMuted : colors.text }}>{player.name}</Txt>
        <Txt style={{ color: colors.textFaint, fontSize: 12 }}>{t.rounds(player.roundsPlayed)}</Txt>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 8 }}>
        {cost !== null && (
          <Txt style={{ color: muted ? colors.textMuted : colors.accent, fontWeight: '600' }}>{cost.toLocaleString()}</Txt>
        )}
        {action}
      </View>
    </View>
  )
}

export default function DoneTab({ players, session, onVolunteer }) {
  const { t } = useLang()
  const done = players.filter(p => p.status === STATUS.DONE)
  const left = players.filter(p => p.status === STATUS.LEAVE)

  const fullRoundPrice = session?.config?.fullRoundPrice ?? 0
  const maxRoundsPerPlayer = session?.config?.maxRoundsPerPlayer ?? 0
  const costOf = (p) => fullRoundPrice > 0 ? calcPlayerCost(p.roundsPlayed, fullRoundPrice, maxRoundsPerPlayer) : null

  if (done.length === 0 && left.length === 0) return <Empty>{t.noDone}</Empty>

  return (
    <View style={{ padding: 16, gap: 8 }}>
      {done.map(p => (
        <Row
          key={p.id}
          player={p}
          cost={costOf(p)}
          action={<Chip tone="purple" label={t.playMore} onPress={() => onVolunteer(p.id)} />}
        />
      ))}

      {left.length > 0 && (
        <>
          {done.length > 0 && <Divider style={{ marginVertical: 4 }} />}
          <Txt style={{ color: colors.textDim, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.leftEarly}</Txt>
          {left.map(p => <Row key={p.id} player={p} cost={costOf(p)} muted />)}
        </>
      )}
    </View>
  )
}
