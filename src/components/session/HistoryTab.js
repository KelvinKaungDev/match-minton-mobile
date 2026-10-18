import { View } from 'react-native'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Empty, SkillBadge, Txt } from '../ui.js'

function Team({ label, tone, players }) {
  return (
    <View style={{ flex: 1 }}>
      <Txt style={{ color: tone, fontSize: 12, fontWeight: '500', marginBottom: 4 }}>{label}</Txt>
      {players.map((p, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 2 }}>
          <SkillBadge skill={p.skill} />
          <Txt numberOfLines={1} style={{ color: '#d6d3d1', fontSize: 12, flexShrink: 1 }}>{p.name}</Txt>
        </View>
      ))}
    </View>
  )
}

export default function HistoryTab({ history = [] }) {
  const { t } = useLang()
  const entries = [...history].filter(e => e.court && e.matchNo != null).reverse()

  if (entries.length === 0) return <Empty>{t.noHistory}</Empty>

  return (
    <View style={{ padding: 16, gap: 8 }}>
      {entries.map(entry => (
        <View key={entry.matchNo} style={{ backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Txt style={{ color: '#d6d3d1', fontWeight: '600' }}>{t.matchNo(entry.matchNo)}</Txt>
            <Txt style={{ color: colors.accent, fontSize: 12, fontWeight: '600' }}>{t.courtLabel(entry.court.name ?? entry.court.id)}</Txt>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Team label={t.teamA} tone={colors.sky} players={entry.court.teamA} />
            <Team label={t.teamB} tone={colors.amber} players={entry.court.teamB} />
          </View>
        </View>
      ))}
    </View>
  )
}
