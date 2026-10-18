import { View } from 'react-native'
import { STATUS } from '../../models/index.js'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Txt } from '../ui.js'

export default function SessionHeader({ players }) {
  const { t } = useLang()
  const count = (status) => players.filter(p => p.status === status).length

  return (
    <View style={{ backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
      <Txt style={{ color: colors.accent, fontSize: 12 }}>{t.playing(count(STATUS.PLAYING))}</Txt>
      <Txt style={{ color: colors.sky, fontSize: 12 }}>{t.benchCount(count(STATUS.BENCH))}</Txt>
      <Txt style={{ color: colors.yellow, fontSize: 12 }}>{t.waitingCount(count(STATUS.WAITING))}</Txt>
      <Txt style={{ color: colors.purple, fontSize: 12 }}>{t.doneCount(count(STATUS.DONE))}</Txt>
    </View>
  )
}
