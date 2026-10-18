import { Pressable, View } from 'react-native'
import { STATUS } from '../../models/index.js'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Card, Chip, Empty, SkillPicker, Txt } from '../ui.js'

export default function PlayerList({ players, maxPlayers = 36, onSkillChange, onToggle, onRemove, onMarkAllBench }) {
  const { t } = useLang()
  const benchCount = players.filter(p => p.status === STATUS.BENCH).length
  const waitingCount = players.filter(p => p.status === STATUS.WAITING).length

  return (
    <Card style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <Txt style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {t.playerCount(players.length, maxPlayers)}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Txt style={{ color: colors.textDim, fontSize: 12 }}>{t.benchWaiting(benchCount, waitingCount)}</Txt>
          {waitingCount > 0 && <Chip label={t.allArrived} tone="sky" onPress={onMarkAllBench} />}
        </View>
      </View>

      {players.length === 0 && <Empty>{t.noPlayers}</Empty>}

      {players.map(player => (
        <View
          key={player.id}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.cardAlt, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }}
        >
          <Chip
            label={player.status === STATUS.BENCH ? t.bench : t.waiting}
            tone={player.status === STATUS.BENCH ? 'sky' : 'yellow'}
            onPress={() => onToggle(player.id)}
          />
          <Txt numberOfLines={1} style={{ flex: 1 }}>{player.name}</Txt>
          <SkillPicker compact value={player.skill} onChange={s => onSkillChange(player.id, s)} />
          <Pressable onPress={() => onRemove(player.id)} hitSlop={8}>
            <Txt style={{ color: colors.textFaint, fontSize: 14, paddingHorizontal: 2 }}>✕</Txt>
          </Pressable>
        </View>
      ))}
    </Card>
  )
}
