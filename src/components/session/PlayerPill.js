import { View } from 'react-native'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Chip, SkillBadge, Txt } from '../ui.js'

export default function PlayerPill({ player, action }) {
  const { t } = useLang()
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
        <SkillBadge skill={player.skill} />
        <Txt numberOfLines={1} style={{ flexShrink: 1 }}>{player.name}</Txt>
        <Txt style={{ color: colors.textFaint, fontSize: 12 }}>{t.rounds(player.roundsPlayed)}</Txt>
      </View>
      {action && <Chip label={action.label} tone={action.tone} onPress={action.onPress} style={{ marginLeft: 8 }} />}
    </View>
  )
}
