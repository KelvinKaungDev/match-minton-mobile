import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { STATUS, SKILL } from '../../models/index.js'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Button, Chip, Empty, Field, SkillPicker, Txt } from '../ui.js'
import PlayerPill from './PlayerPill.js'

function WalkInForm({ onWalkIn, maxPlayers, playerCount }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [skill, setSkill] = useState(SKILL.B)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    try {
      const result = await onWalkIn(trimmed, skill)
      if (result?.error === 'duplicate') return setError(t.duplicateName)
      if (result?.error === 'max') return setError(t.sessionFull(maxPlayers))
      setName('')
      setError('')
      setOpen(false)
    } catch {
      setError('เกิดข้อผิดพลาด ลองใหม่อีกครั้ง')
    }
  }

  if (!open) {
    return (
      <Pressable
        onPress={() => setOpen(true)}
        disabled={playerCount >= maxPlayers}
        style={{ paddingVertical: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 12, alignItems: 'center', opacity: playerCount >= maxPlayers ? 0.4 : 1 }}
      >
        <Txt style={{ color: colors.textDim, fontWeight: '500' }}>{t.walkIn}</Txt>
      </Pressable>
    )
  }

  return (
    <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Txt style={{ fontWeight: '600' }}>{t.walkInTitle}</Txt>
        <Pressable onPress={() => { setOpen(false); setError('') }} hitSlop={8}>
          <Txt style={{ color: colors.textDim, fontSize: 12 }}>{t.cancel}</Txt>
        </Pressable>
      </View>
      <Field autoFocus value={name} onChangeText={v => { setName(v); setError('') }} placeholder={t.playerName} />
      <SkillPicker value={skill} onChange={setSkill} />
      {error ? <Txt style={{ color: colors.red, fontSize: 12 }}>{error}</Txt> : null}
      <Button label={t.addToBench} onPress={handleSubmit} disabled={!name.trim()} style={{ paddingVertical: 10 }} />
    </View>
  )
}

export default function BenchTab({ players, session, onLeave, onFillCourts, onWalkIn }) {
  const { t } = useLang()
  const bench = players
    .filter(p => p.status === STATUS.BENCH)
    .sort((a, b) => a.roundsPlayed - b.roundsPlayed)

  const emptyCourts = (session?.config?.courts ?? 0) - (session?.courts?.length ?? 0)
  const courtsCanFill = Math.min(emptyCourts, Math.floor(bench.length / 4))
  const showFill = emptyCourts > 0 && bench.length >= 4
  const maxPlayers = session?.config?.maxPlayers ?? 36

  return (
    <View style={{ padding: 16, gap: 12 }}>
      {showFill && (
        <View style={{ backgroundColor: 'rgba(10,45,26,0.6)', borderWidth: 1, borderColor: 'rgba(52,211,153,0.3)', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Txt style={{ color: colors.accent, fontWeight: '600' }}>{t.onBench(bench.length)}</Txt>
            <Txt style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{t.emptyCourts(emptyCourts, courtsCanFill)}</Txt>
          </View>
          <Pressable onPress={onFillCourts} style={{ backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 }}>
            <Txt style={{ color: colors.onAccent, fontWeight: '600' }}>{t.matchNow}</Txt>
          </Pressable>
        </View>
      )}

      <WalkInForm onWalkIn={onWalkIn} maxPlayers={maxPlayers} playerCount={players.length} />

      {bench.length === 0 && <Empty>{t.noBench}</Empty>}

      {bench.map(p => (
        <PlayerPill key={p.id} player={p} action={{ label: t.leave, tone: 'red', onPress: () => onLeave(p.id) }} />
      ))}
    </View>
  )
}
