import { View } from 'react-native'
import { colors, tints } from '../../lib/theme.js'
import { Card, Dots, Txt } from '../ui.js'

function CourtScoreCard({ court }) {
  const {
    courtName, courtNumber,
    teamA = [], teamB = [],
    scoreConfig = {},
    currentScore, currentGame, matchWinner, matchStatus, gamesWon, completedGames,
  } = court

  const score = currentScore ?? { teamA: 0, teamB: 0 }
  const wins = gamesWon ?? { teamA: 0, teamB: 0 }
  const totalGames = scoreConfig.numberOfGames ?? 3
  const gamesNeeded = Math.ceil(totalGames / 2)
  const isFinished = matchStatus === 'finished' || !!matchWinner
  const hasScoring = !!currentScore

  const badge = isFinished
    ? { text: `${matchWinner === 'teamA' ? 'Team A' : 'Team B'} Wins`, bg: tints.amber, fg: colors.amber }
    : hasScoring
      ? { text: `G${currentGame ?? 1}/${totalGames}`, bg: tints.accent, fg: colors.accent }
      : { text: 'Waiting', bg: colors.border, fg: colors.textDim }

  const side = (key, color) => (
    <View style={{ flex: 1, alignItems: 'center', gap: 6 }}>
      <Txt style={{ fontSize: 36, fontWeight: '900', color: matchWinner === key ? color : colors.text }}>{score[key]}</Txt>
      <Dots won={wins[key]} needed={gamesNeeded} color={color} />
    </View>
  )

  return (
    <Card style={{ borderWidth: 1, borderColor: isFinished ? 'rgba(245,158,11,0.3)' : colors.borderSoft, padding: 14, gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Txt style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Court {courtName ?? courtNumber}
        </Txt>
        <View style={{ backgroundColor: badge.bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Txt style={{ color: badge.fg, fontSize: 12, fontWeight: '600' }}>{badge.text}</Txt>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {side('teamA', '#34d399')}
        <Txt style={{ color: colors.textFaint, fontSize: 20 }}>—</Txt>
        {side('teamB', colors.sky)}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <Txt numberOfLines={1} style={{ flex: 1, color: colors.textFaint, fontSize: 12 }}>{teamA.map(p => p.name).join(', ') || 'Team A'}</Txt>
        <Txt numberOfLines={1} style={{ flex: 1, color: colors.textFaint, fontSize: 12, textAlign: 'right' }}>{teamB.map(p => p.name).join(', ') || 'Team B'}</Txt>
      </View>

      {completedGames?.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {completedGames.map(g => (
            <View key={g.game} style={{ backgroundColor: g.winner === 'teamA' ? tints.accent : 'rgba(56,189,248,0.15)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Txt style={{ fontSize: 12, color: g.winner === 'teamA' ? '#34d399' : colors.sky }}>{g.teamA}-{g.teamB}</Txt>
            </View>
          ))}
        </View>
      )}
    </Card>
  )
}

export default function LiveScoreOverview({ courts = [] }) {
  if (courts.length === 0) return null

  const finished = courts.filter(c => c.matchWinner).length
  const playing = courts.length - finished

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Txt style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Live Scores</Txt>
        {finished > 0 && <Txt style={{ color: colors.textDim, fontSize: 12 }}>{finished}/{courts.length} complete</Txt>}
      </View>
      {courts.map(court => <CourtScoreCard key={court.id} court={court} />)}
      {playing === 0 && finished > 0 && (
        <Txt style={{ textAlign: 'center', color: '#34d399', fontWeight: '600' }}>All matches complete 🏆</Txt>
      )}
    </View>
  )
}
