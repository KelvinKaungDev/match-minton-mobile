import { View } from 'react-native'
import { STATUS } from '../../models/index.js'
import { useLang } from '../../context/LangContext.js'
import { Empty } from '../ui.js'
import PlayerPill from './PlayerPill.js'

export default function WaitingTab({ players, onActivate }) {
  const { t } = useLang()
  const waiting = players.filter(p => p.status === STATUS.WAITING)

  if (waiting.length === 0) return <Empty>{t.noWaiting}</Empty>

  return (
    <View style={{ padding: 16, gap: 8 }}>
      {waiting.map(p => (
        <PlayerPill key={p.id} player={p} action={{ label: t.arrived, tone: 'yellow', onPress: () => onActivate(p.id) }} />
      ))}
    </View>
  )
}
