import { Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import QRCode from 'react-native-qrcode-svg'
import { useCompetitionScoring } from '../../hooks/useCompetitionScoring.js'
import { WEB_URL } from '../../services/apiClient.js'
import { colors } from '../../lib/theme.js'
import { Button, Card, Dots, Loading, Txt } from '../../components/ui.js'
import ScoreControl from '../../components/competition/ScoreControl.js'

const ERRORS = {
  'not-found': { title: 'Court Not Found', body: "This code doesn't match any active court.", color: colors.red },
  'session-ended': { title: 'Session Has Ended', body: 'The organiser has closed this competition session.', color: colors.amber },
  error: { title: 'Connection Error', body: 'Could not reach the server. Please check your connection.', color: colors.red },
}

const goToEntry = () => router.replace('/judge')

function ErrorScreen({ error }) {
  const { title, body, color } = ERRORS[error] ?? ERRORS.error
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Txt style={{ fontSize: 32, fontWeight: '900', color, marginBottom: 12, textAlign: 'center' }}>{title}</Txt>
      <Txt style={{ color: colors.textMuted, textAlign: 'center', marginBottom: 32 }}>{body}</Txt>
      <Button label="← Try Another Code" variant="secondary" onPress={goToEntry} style={{ paddingHorizontal: 24 }} />
    </SafeAreaView>
  )
}

function WinnerBanner({ matchState, courtId }) {
  const { matchWinner, gamesWon, completedGames } = matchState
  const isA = matchWinner === 'teamA'
  const color = isA ? '#34d399' : colors.sky
  // The QR points at the public web result page so players don't need the app
  const resultUrl = `${WEB_URL}/result/${courtId}`

  return (
    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(12,10,9,0.97)', zIndex: 50 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Txt style={{ fontSize: 56, marginBottom: 12 }}>🏆</Txt>
          <Txt style={{ fontSize: 34, fontWeight: '900', color, marginBottom: 4 }}>{isA ? 'Team A' : 'Team B'} Wins!</Txt>
          <Txt style={{ color: colors.textMuted, marginBottom: 20 }}>Match score: {gamesWon.teamA} — {gamesWon.teamB} games</Txt>

          <View style={{ alignSelf: 'stretch', maxWidth: 320, borderWidth: 1, borderColor: isA ? 'rgba(16,185,129,0.3)' : 'rgba(14,165,233,0.3)', backgroundColor: isA ? 'rgba(16,185,129,0.1)' : 'rgba(14,165,233,0.1)', borderRadius: 12, padding: 16, gap: 8, marginBottom: 28 }}>
            {completedGames.map(g => (
              <View key={g.game} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Txt style={{ color: colors.textDim }}>Game {g.game}</Txt>
                <Txt style={{ fontWeight: '700' }}>{g.teamA} — {g.teamB}</Txt>
                <Txt style={{ fontSize: 12, fontWeight: '600', color: g.winner === 'teamA' ? '#34d399' : colors.sky }}>
                  {g.winner === 'teamA' ? 'Team A' : 'Team B'}
                </Txt>
              </View>
            ))}
          </View>

          <View style={{ backgroundColor: '#fff', padding: 8, borderRadius: 12, marginBottom: 8 }}>
            <QRCode value={resultUrl} size={112} ecl="M" />
          </View>
          <Txt style={{ color: colors.textDim, fontSize: 12, marginBottom: 24 }}>Players: scan to get your result card</Txt>

          <Button label="Score Another Court" variant="secondary" onPress={goToEntry} style={{ paddingHorizontal: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

function ScoreSide({ label, score, won, needed, color }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 8 }}>
      <Txt style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Txt>
      <Txt style={{ fontSize: 88, fontWeight: '900', color, lineHeight: 96 }}>{score}</Txt>
      <Dots won={won} needed={needed} color={color} />
    </View>
  )
}

export default function JudgeView() {
  const { code } = useLocalSearchParams()
  const { courtData, matchState, loading, error, scorePoint, undoLastPoint, canUndo } = useCompetitionScoring(code)

  if (loading) return <Loading label="Loading court…" />
  if (error) return <ErrorScreen error={error} />

  const { courtName, courtNumber, teamA = [], teamB = [], scoreConfig = {} } = courtData

  const score = matchState?.currentScore ?? { teamA: 0, teamB: 0 }
  const gamesWon = matchState?.gamesWon ?? { teamA: 0, teamB: 0 }
  const gamesNeeded = matchState?.gamesNeededToWin ?? 1
  const currentGame = matchState?.currentGame ?? 1
  const totalGames = scoreConfig.numberOfGames ?? 3
  const isFinished = !!matchState?.matchWinner

  const { pointsToWin, deuceRule } = scoreConfig
  const hi = Math.max(score.teamA, score.teamB)
  const lo = Math.min(score.teamA, score.teamB)
  let indicator = null
  if (!isFinished) {
    if (deuceRule && hi >= pointsToWin - 1 && hi === lo) indicator = 'DEUCE'
    else if (hi >= pointsToWin - 1 && hi !== lo) indicator = `${score.teamA > score.teamB ? 'Team A' : 'Team B'} — SET POINT`
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.borderSoft, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={goToEntry} hitSlop={10} style={{ width: 64 }}>
          <Txt style={{ color: colors.textMuted }}>← Back</Txt>
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Txt style={{ fontWeight: '700' }}>Court {courtName ?? courtNumber}</Txt>
          <Txt style={{ color: colors.textDim, fontSize: 12 }}>{isFinished ? 'Match complete' : `Game ${currentGame} of ${totalGames}`}</Txt>
        </View>
        <Txt style={{ width: 64, textAlign: 'right', color: colors.textFaint, fontSize: 12, letterSpacing: 2 }}>{code}</Txt>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Card style={{ borderRadius: 16, borderWidth: 1, borderColor: colors.borderSoft, paddingVertical: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ScoreSide label="Team A" score={score.teamA} won={gamesWon.teamA} needed={gamesNeeded} color="#34d399" />
            <Txt style={{ color: colors.border, fontSize: 32, paddingHorizontal: 4 }}>—</Txt>
            <ScoreSide label="Team B" score={score.teamB} won={gamesWon.teamB} needed={gamesNeeded} color={colors.sky} />
          </View>
          {indicator && <Txt style={{ textAlign: 'center', color: colors.amber, fontSize: 12, fontWeight: '600', marginTop: 12 }}>{indicator}</Txt>}
        </Card>

        <ScoreControl
          teamA={teamA}
          teamB={teamB}
          onScore={scorePoint}
          onUndo={undoLastPoint}
          canUndo={canUndo}
          disabled={isFinished}
        />

        {(matchState?.completedGames ?? []).length > 0 && (
          <Card style={{ borderWidth: 1, borderColor: colors.borderSoft, gap: 10 }}>
            <Txt style={{ color: colors.textDim, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Game History</Txt>
            {matchState.completedGames.map(g => (
              <View key={g.game} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Txt style={{ color: colors.textDim }}>Game {g.game}</Txt>
                <Txt style={{ fontWeight: '700' }}>{g.teamA} — {g.teamB}</Txt>
                <View style={{ backgroundColor: g.winner === 'teamA' ? 'rgba(16,185,129,0.2)' : 'rgba(14,165,233,0.2)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <Txt style={{ fontSize: 12, fontWeight: '600', color: g.winner === 'teamA' ? '#34d399' : colors.sky }}>
                    {g.winner === 'teamA' ? 'Team A' : 'Team B'}
                  </Txt>
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      {isFinished && <WinnerBanner matchState={matchState} courtId={courtData.id} />}
    </SafeAreaView>
  )
}
