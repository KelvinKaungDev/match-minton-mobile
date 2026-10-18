import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { SKILL } from '../../models/index.js'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Button, Card, Field, SkillPicker, Txt } from '../ui.js'

// Pulls "1. Name" style lines out of a pasted Line/Chat list; duplicates get a "(n)" suffix.
export function parseBulkNames(text) {
  const processed = text.replace(/\s+(\d+\.(?!\d))/g, '\n$1')

  const rawNames = []
  for (const line of processed.split('\n')) {
    const match = line.trim().match(/^\d+\.\s*(.+)/)
    if (!match) continue
    const name = match[1].replace(/\s*\([^)]*\)/g, '').trim()
    if (!name || name.length < 2 || name.length > 25) continue
    rawNames.push(name)
  }

  const count = {}
  for (const name of rawNames) {
    const key = name.toLowerCase()
    count[key] = (count[key] || 0) + 1
  }

  const occurrence = {}
  return rawNames.map(name => {
    const key = name.toLowerCase()
    if (count[key] === 1) return name
    occurrence[key] = (occurrence[key] || 0) + 1
    return `${name} (${occurrence[key]})`
  })
}

function ModeToggle({ mode, onChange }) {
  const { t } = useLang()
  const opt = (key, label) => (
    <Pressable
      onPress={() => onChange(key)}
      style={{ paddingHorizontal: 12, paddingVertical: 5, backgroundColor: mode === key ? colors.accent : 'transparent' }}
    >
      <Txt style={{ fontSize: 12, fontWeight: '500', color: mode === key ? colors.onAccent : colors.textMuted }}>{label}</Txt>
    </Pressable>
  )
  return (
    <View style={{ flexDirection: 'row', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
      {opt('single', t.single)}
      {opt('bulk', t.bulk)}
    </View>
  )
}

export default function AddPlayer({ onAdd, onAddBulk, maxPlayers = 36 }) {
  const { t } = useLang()
  const [mode, setMode] = useState('single')
  const [name, setName] = useState('')
  const [skill, setSkill] = useState(SKILL.B)
  const [bulkText, setBulkText] = useState('')
  const [bulkSkill, setBulkSkill] = useState(SKILL.B)
  const [editableNames, setEditableNames] = useState([])
  const [error, setError] = useState('')

  const handleBulkTextChange = (text) => {
    setBulkText(text)
    setEditableNames(parseBulkNames(text))
  }

  const handleSingle = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const result = await onAdd(trimmed, skill)
    if (result?.error === 'duplicate') setError(t.duplicateName)
    else if (result?.error === 'max') setError(t.maxReached(maxPlayers))
    else if (!result?.error) { setName(''); setError('') }
  }

  const handleBulk = async () => {
    const names = editableNames.map(n => n.trim()).filter(n => n.length >= 2)
    if (names.length === 0) return
    const result = await onAddBulk(names, bulkSkill)
    if (result?.error) return
    setBulkText('')
    setEditableNames([])
  }

  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Txt style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t.addPlayers}</Txt>
        <ModeToggle mode={mode} onChange={setMode} />
      </View>

      {mode === 'single' ? (
        <View style={{ gap: 12 }}>
          <Field
            value={name}
            onChangeText={v => { setName(v); setError('') }}
            placeholder={t.playerName}
            returnKeyType="done"
            onSubmitEditing={handleSingle}
          />
          <SkillPicker value={skill} onChange={setSkill} />
          {error ? <Txt style={{ color: colors.red, fontSize: 12 }}>{error}</Txt> : null}
          <Button label={t.addPlayer} onPress={handleSingle} disabled={!name.trim()} />
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          <Field
            value={bulkText}
            onChangeText={handleBulkTextChange}
            placeholder={t.bulkPlaceholder}
            multiline
            numberOfLines={7}
            style={{ minHeight: 140 }}
          />

          {bulkText.length > 0 && editableNames.length === 0 && (
            <Txt style={{ color: '#eab308', fontSize: 12 }}>{t.bulkNoNames}</Txt>
          )}

          {editableNames.length > 0 && (
            <View style={{ backgroundColor: colors.cardAlt, borderRadius: 8, padding: 10, gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Txt style={{ color: colors.accent, fontSize: 12, fontWeight: '500' }}>{t.bulkFound(editableNames.length)}</Txt>
                <Pressable onPress={() => { setBulkText(''); setEditableNames([]) }} hitSlop={8}>
                  <Txt style={{ color: colors.red, fontSize: 12, fontWeight: '500' }}>{t.clearAll}</Txt>
                </Pressable>
              </View>
              {editableNames.map((n, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Txt style={{ color: colors.textDim, fontSize: 12, width: 22, textAlign: 'right' }}>{i + 1}.</Txt>
                  <Field
                    value={n}
                    onChangeText={v => setEditableNames(prev => prev.map((x, idx) => idx === i ? v : x))}
                    style={{ flex: 1, backgroundColor: colors.border, paddingVertical: 6, fontSize: 13 }}
                  />
                  <Pressable onPress={() => setEditableNames(prev => prev.filter((_, idx) => idx !== i))} hitSlop={8}>
                    <Txt style={{ color: colors.textDim, fontSize: 14 }}>✕</Txt>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <SkillPicker value={bulkSkill} onChange={setBulkSkill} />
          <Button
            label={editableNames.length > 0 ? t.importCount(editableNames.length) : t.importBtn}
            onPress={handleBulk}
            disabled={editableNames.length === 0}
          />
        </View>
      )}
    </Card>
  )
}
