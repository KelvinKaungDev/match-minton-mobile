import { useState } from 'react'
import { Alert, Switch, View } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { useCompetition } from '../../hooks/useCompetition.js'
import { WEB_URL } from '../../services/apiClient.js'
import { colors } from '../../lib/theme.js'
import { Button, Card, Chip, Divider, Loading, Stepper, Txt } from '../ui.js'
import ProGate from './ProGate.js'
import CourtCodeCard from './CourtCodeCard.js'
import LiveScoreOverview from './LiveScoreOverview.js'

function CopyUrlRow({ sessionId }) {
  const [copied, setCopied] = useState(false)
  const url = `${WEB_URL}/scoreboard/${sessionId}`
  const copy = async () => {
    await Clipboard.setStringAsync(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderWidth: 1, borderColor: colors.borderSoft }}>
      <View style={{ flex: 1 }}>
        <Txt style={{ color: colors.textDim, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Scoreboard URL</Txt>
        <Txt numberOfLines={1} style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{url}</Txt>
      </View>
      <Chip tone={copied ? 'accent' : 'stone'} label={copied ? '✓ Copied' : 'Copy'} onPress={copy} />
    </Card>
  )
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Txt style={{ fontWeight: '500' }}>{label}</Txt>
        {hint ? <Txt style={{ color: colors.textDim, fontSize: 12, marginTop: 2 }}>{hint}</Txt> : null}
      </View>
      <Switch
        value={checked}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor="#fff"
      />
    </View>
  )
}

function CompetitionContent({ courts }) {
  const { config, updateConfig, restoring, activeSessionId, activeCourts, starting, startCompetition, syncCourts, endCompetition } = useCompetition()
  const [syncing, setSyncing] = useState(false)

  if (restoring) return <Loading />

  const activeCourtsWithPlayers = courts.filter(c => c.teamA.length > 0 || c.teamB.length > 0)

  // Session courts whose players differ from what's registered in the competition
  const courtsToSync = activeCourtsWithPlayers.filter(sessionCourt => {
    const label = sessionCourt.name ?? String(sessionCourt.id)
    const existing = activeCourts.find(c => (c.courtName ?? String(c.courtNumber)) === label)
    if (!existing) return true
    const registeredIds = new Set([...(existing.teamA ?? []), ...(existing.teamB ?? [])].map(p => p.id))
    return [...sessionCourt.teamA, ...sessionCourt.teamB].some(p => !registeredIds.has(p.id))
  })

  const handleSync = async () => {
    setSyncing(true)
    try { await syncCourts(courtsToSync) } catch (err) { Alert.alert('Could not update courts', err.message) } finally { setSyncing(false) }
  }

  const handleStart = async () => {
    try { await startCompetition(activeCourtsWithPlayers) } catch (err) { Alert.alert('Could not start competition', err.message) }
  }

  const confirmEnd = () => {
    Alert.alert('End competition?', 'Judges will no longer be able to score.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End', style: 'destructive', onPress: () => endCompetition().catch(err => Alert.alert('Error', err.message)) },
    ])
  }

  if (activeSessionId) {
    return (
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Txt style={{ fontWeight: '700', fontSize: 16 }}>Competition Active</Txt>
            <Txt style={{ color: colors.textDim, fontSize: 12, marginTop: 2 }}>Share codes or QR with judges</Txt>
          </View>
          <Chip tone="stone" label="End Competition" onPress={confirmEnd} />
        </View>

        <CopyUrlRow sessionId={activeSessionId} />

        {courtsToSync.length > 0 && (
          <Button
            variant="outline"
            onPress={handleSync}
            loading={syncing}
            label={`↺ Update ${courtsToSync.length} court${courtsToSync.length > 1 ? 's' : ''} with new teams`}
            style={{ paddingVertical: 11 }}
          />
        )}

        {activeCourts.length === 0 ? (
          <Txt style={{ color: colors.textDim, textAlign: 'center', paddingVertical: 24 }}>Loading courts…</Txt>
        ) : (
          <>
            {activeCourts.map(court => <CourtCodeCard key={court.id} court={court} />)}
            <Divider />
            <LiveScoreOverview courts={activeCourts} />
          </>
        )}
      </View>
    )
  }

  return (
    <View style={{ gap: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(245,158,11,0.2)', alignItems: 'center', justifyContent: 'center' }}>
          <Txt style={{ fontSize: 16 }}>🏆</Txt>
        </View>
        <View>
          <Txt style={{ fontWeight: '700', fontSize: 16 }}>Competition Mode</Txt>
          <Txt style={{ color: colors.textDim, fontSize: 12 }}>Configure scoring rules for this round</Txt>
        </View>
      </View>

      <Card style={{ gap: 16 }}>
        <Stepper
          label="Points to Win" hint="Standard rally point scoring"
          value={config.pointsToWin} min={11} max={30}
          onChange={v => updateConfig('pointsToWin', v)}
        />
        <Divider />
        <Stepper
          label="Number of Games" hint="Best of this many games"
          value={config.numberOfGames} min={1} max={5}
          onChange={v => updateConfig('numberOfGames', v)}
        />
        <Divider />
        <ToggleRow
          label="Deuce Rule" hint="Must win by 2 when tied"
          checked={config.deuceRule}
          onChange={v => updateConfig('deuceRule', v)}
        />
        {config.deuceRule && (
          <>
            <Divider />
            <Stepper
              label="Max Points (Deuce Cap)" hint="Game ends at this score regardless"
              value={config.maxPoints} min={config.pointsToWin + 1} max={40}
              onChange={v => updateConfig('maxPoints', v)}
            />
          </>
        )}
      </Card>

      {activeCourtsWithPlayers.length > 0 ? (
        <Card style={{ gap: 10 }}>
          <Txt style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Courts to register ({activeCourtsWithPlayers.length})
          </Txt>
          {activeCourtsWithPlayers.map((court, i) => (
            <View key={court.id}>
              <Txt style={{ color: colors.textDim, fontSize: 12 }}>Court {court.name ?? i + 1}</Txt>
              <Txt numberOfLines={1}>
                {court.teamA.map(p => p.name).join(', ')}
                <Txt style={{ color: colors.textFaint }}>  vs  </Txt>
                {court.teamB.map(p => p.name).join(', ')}
              </Txt>
            </View>
          ))}
        </Card>
      ) : (
        <Card>
          <Txt style={{ color: colors.textDim, textAlign: 'center' }}>No active courts — start a session round first</Txt>
        </Card>
      )}

      <Button
        label={starting ? 'Starting…' : `Start Competition (${activeCourtsWithPlayers.length} courts)`}
        onPress={handleStart}
        loading={starting}
        disabled={activeCourtsWithPlayers.length === 0}
      />
    </View>
  )
}

export default function CompetitionSetup({ courts = [] }) {
  return (
    <ProGate>
      <CompetitionContent courts={courts} />
    </ProGate>
  )
}
