import { View } from 'react-native'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Chip, Divider, SkillBadge, Txt } from '../ui.js'

function PlayerRow({ player, onLeave, onSwapSelect, isSwapping }) {
  const { t } = useLang()
  return (
    <View style={{ paddingVertical: 4, paddingHorizontal: 4, borderRadius: 6, backgroundColor: isSwapping ? 'rgba(245,158,11,0.1)' : 'transparent' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <SkillBadge skill={player.skill} />
        <Txt numberOfLines={1} style={{ fontSize: 13, flex: 1 }}>{player.name}</Txt>
      </View>
      <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
        <Chip small active={isSwapping} tone="amber" label={t.swap} onPress={() => onSwapSelect(player.id)} />
        <Chip small tone="red" label={t.leave} onPress={() => onLeave(player.id)} />
      </View>
    </View>
  )
}

function TeamBlock({ label, tone, players, ...rowProps }) {
  return (
    <View>
      <Txt style={{ color: tone, fontSize: 11, fontWeight: '600', marginBottom: 2 }}>{label}</Txt>
      {players.map(p => (
        <PlayerRow key={p.id} player={p} isSwapping={rowProps.swapPlayerId === p.id} {...rowProps} />
      ))}
    </View>
  )
}

export default function CourtCard({
  court, onLeave, onComplete, onRefill, canRefill,
  swapPlayerId, benchPlayers, onSwapSelect, onSwapConfirm, onCancelSwap,
}) {
  const { t } = useLang()
  const isEmpty = court.teamA.length === 0 && court.teamB.length === 0
  const swappingPlayer = swapPlayerId
    ? [...court.teamA, ...court.teamB].find(p => p.id === swapPlayerId)
    : null

  const label = (
    <Txt style={{ color: colors.textDim, fontSize: 11, fontWeight: '600', letterSpacing: 1.5 }}>
      {t.courtLabel(court.name ?? court.id)}
    </Txt>
  )

  if (isEmpty) {
    return (
      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, gap: 8 }}>
        {label}
        <View style={{ alignItems: 'center', gap: 8, paddingVertical: 8 }}>
          <Txt style={{ color: colors.textFaint, fontSize: 12 }}>{t.courtEmpty}</Txt>
          <Chip
            tone="teal"
            label={canRefill ? t.startMatch : t.need4}
            onPress={() => onRefill(court.id)}
            disabled={!canRefill}
          />
        </View>
      </View>
    )
  }

  const rowProps = {
    onLeave,
    onSwapSelect: (pid) => onSwapSelect(pid, court.id),
    swapPlayerId,
  }

  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12, gap: 8 }}>
      {label}
      <TeamBlock label={t.teamA} tone={colors.sky} players={court.teamA} {...rowProps} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Divider style={{ flex: 1 }} />
        <Txt style={{ color: colors.textFaint, fontSize: 10, fontWeight: '700' }}>VS</Txt>
        <Divider style={{ flex: 1 }} />
      </View>

      <TeamBlock label={t.teamB} tone={colors.amber} players={court.teamB} {...rowProps} />

      <View style={{ paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.borderSoft }}>
        {swappingPlayer ? (
          <View style={{ gap: 6 }}>
            <Txt style={{ color: colors.amber, fontSize: 11, fontWeight: '600' }}>{t.swapWith(swappingPlayer.name)}</Txt>
            {benchPlayers.length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                {benchPlayers.map(p => (
                  <Chip key={p.id} small tone="stone" label={`${p.skill} ${p.name}`} onPress={() => onSwapConfirm(p.id)} />
                ))}
              </View>
            ) : (
              <Txt style={{ color: colors.textDim, fontSize: 11 }}>{t.noBenchForSwap}</Txt>
            )}
            <Chip small tone="stone" label={t.cancelSwap} onPress={onCancelSwap} style={{ alignSelf: 'stretch', alignItems: 'center' }} />
          </View>
        ) : (
          <Chip tone="teal" label={t.courtDone} onPress={() => onComplete(court.id)} style={{ alignItems: 'center' }} />
        )}
      </View>
    </View>
  )
}
