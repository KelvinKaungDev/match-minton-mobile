import { useState } from 'react'
import { View } from 'react-native'
import { STATUS } from '../../models/index.js'
import { useLang } from '../../context/LangContext.js'
import { Empty } from '../ui.js'
import CourtCard from './CourtCard.js'

export default function CourtsTab({ courts, onLeave, onComplete, onRefill, onSwap, players = [] }) {
  const { t } = useLang()
  const benchPlayers = players.filter(p => p.status === STATUS.BENCH)

  // { playerId, courtId } | null
  const [swapTarget, setSwapTarget] = useState(null)

  const handleSwapSelect = (playerId, courtId) => {
    setSwapTarget(prev => prev?.playerId === playerId ? null : { playerId, courtId })
  }

  const handleSwapConfirm = async (benchPlayerId) => {
    if (!swapTarget) return
    await onSwap(swapTarget.playerId, benchPlayerId, swapTarget.courtId)
    setSwapTarget(null)
  }

  if (courts.length === 0) return <Empty>{t.noCourts}</Empty>

  return (
    <View style={{ padding: 12, gap: 8 }}>
      {courts.map(court => (
        <CourtCard
          key={court.id}
          court={court}
          onLeave={onLeave}
          onComplete={onComplete}
          onRefill={onRefill}
          canRefill={benchPlayers.length >= 4}
          swapPlayerId={swapTarget?.courtId === court.id ? swapTarget.playerId : null}
          benchPlayers={benchPlayers}
          onSwapSelect={handleSwapSelect}
          onSwapConfirm={handleSwapConfirm}
          onCancelSwap={() => setSwapTarget(null)}
        />
      ))}
    </View>
  )
}
