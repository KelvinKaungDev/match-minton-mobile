import { useEffect, useRef, useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import * as Clipboard from 'expo-clipboard'
import * as Sharing from 'expo-sharing'
import { captureRef } from 'react-native-view-shot'
import { api, WEB_URL } from '../../services/apiClient.js'
import { colors } from '../../lib/theme.js'
import { Button, Loading, Txt } from '../../components/ui.js'

export default function ResultPage() {
  const { courtId } = useLocalSearchParams()
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState('')
  const cardRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    api.get(`/api/competition-courts/${courtId}/result`)
      .then(data => { if (!cancelled) setResult(data) })
      .catch(err => { if (!cancelled) setError(err.message) })
    return () => { cancelled = true }
  }, [courtId])

  const shell = (children) => (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} hitSlop={10} style={{ padding: 16 }}>
        <Txt style={{ color: colors.textMuted }}>← Back</Txt>
      </Pressable>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 16, paddingBottom: 32 }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  )

  if (error) return shell(<Txt style={{ color: colors.red, marginTop: 64 }}>{error}</Txt>)
  if (!result) return <Loading label="Loading…" />

  if (!result.shareEnabled) {
    return shell(
      <View style={{ marginTop: 64, maxWidth: 300, alignItems: 'center' }}>
        <Txt style={{ fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' }}>Result sharing is a Pro feature</Txt>
        <Txt style={{ color: colors.textMuted, textAlign: 'center' }}>Ask the organiser to upgrade to Pro to get shareable match cards.</Txt>
      </View>
    )
  }

  if (result.status !== 'finished') {
    return shell(<Txt style={{ color: colors.textMuted, marginTop: 64 }}>This match isn't finished yet. Check back soon.</Txt>)
  }

  const gamesWon = { teamA: 0, teamB: 0 }
  result.games.forEach(g => { if (g.winner) gamesWon[g.winner]++ })

  const share = async () => {
    try {
      // Capture just the card as an image; share the file only (a title/url alongside breaks AirDrop)
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 })
      if (!(await Sharing.isAvailableAsync())) return setNotice('Sharing is not available on this device')
      await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' })
      setNotice('')
    } catch {
      setNotice('Could not share. Try again.')
    }
  }

  const copyLink = async () => {
    await Clipboard.setStringAsync(`${WEB_URL}/result/${courtId}`)
    setNotice('Link copied')
  }

  const teamColor = { teamA: '#34d399', teamB: colors.sky }

  return shell(
    <>
      {/* Everything inside this view becomes the shared image */}
      <View ref={cardRef} collapsable={false} style={{ width: '100%', maxWidth: 380, backgroundColor: '#0a1f18', borderRadius: 20, padding: 20, alignItems: 'center' }}>
        <Txt style={{ color: colors.accent, fontWeight: '800', letterSpacing: 1 }}>🏸 MATCH MINTON</Txt>
        <Txt style={{ color: colors.textMuted, marginTop: 4 }}>{result.sessionName} · Court {result.courtNumber}</Txt>

        <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'stretch' }}>
          {['teamA', 'teamB'].map(team => (
            <View key={team} style={{ flex: 1, alignItems: 'center' }}>
              <Txt style={{ color: teamColor[team], fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {team === 'teamA' ? 'Team A' : 'Team B'}
              </Txt>
              <Txt style={{ color: teamColor[team], fontSize: 68, fontWeight: '900', lineHeight: 76 }}>{gamesWon[team]}</Txt>
              {result.winner === team && <Txt style={{ color: colors.amber, fontSize: 12, fontWeight: '700' }}>🏆 Winner</Txt>}
              <View style={{ marginTop: 8, alignItems: 'center' }}>
                {(team === 'teamA' ? result.teamAPlayers : result.teamBPlayers).map(n => (
                  <Txt key={n} numberOfLines={1}>{n}</Txt>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={{ alignSelf: 'stretch', borderTopWidth: 1, borderTopColor: colors.borderSoft, marginTop: 16, paddingTop: 12, gap: 4, alignItems: 'center' }}>
          {result.games.map(g => (
            <Txt key={g.gameNumber} style={{ color: '#d6d3d1' }}>
              Game {g.gameNumber}: <Txt style={{ fontWeight: '700' }}>{g.teamAScore} — {g.teamBScore}</Txt>
            </Txt>
          ))}
        </View>
      </View>

      <Button label="Share result" onPress={share} style={{ marginTop: 24, alignSelf: 'stretch', maxWidth: 380 }} />
      <Button label="Copy link" variant="secondary" onPress={copyLink} style={{ marginTop: 12, alignSelf: 'stretch', maxWidth: 380 }} />
      {notice ? <Txt style={{ color: colors.textMuted, fontSize: 12, marginTop: 12 }}>{notice}</Txt> : null}
    </>
  )
}
