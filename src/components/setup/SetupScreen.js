import { useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from 'react-native'
import { STATUS } from '../../models/index.js'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Button, Card, Field, Txt } from '../ui.js'
import SessionConfig from './SessionConfig.js'
import AddPlayer from './AddPlayer.js'
import PlayerList from './PlayerList.js'

function ConfigErrorAlert({ errors, onDismiss }) {
  const { t } = useLang()
  return (
    <View style={{ backgroundColor: 'rgba(69,10,10,0.6)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.4)', borderRadius: 12, padding: 16, gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Txt style={{ color: colors.red, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' }}>{t.configErrorTitle}</Txt>
        <Pressable onPress={onDismiss} hitSlop={8}><Txt style={{ color: colors.red }}>✕</Txt></Pressable>
      </View>
      {errors.map((err, i) => (
        <Txt key={i} style={{ color: '#fca5a5' }}>• {err}</Txt>
      ))}
    </View>
  )
}

function PricePrompt({ onConfirm, onSkip }) {
  const { t } = useLang()
  const [price, setPrice] = useState('')

  const handleConfirm = () => {
    const val = parseInt(price, 10)
    onConfirm(isNaN(val) || val <= 0 ? 0 : val)
  }

  return (
    <Modal transparent animationType="fade" onRequestClose={onSkip}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', padding: 16 }}
      >
        <Card style={{ borderWidth: 1, borderColor: colors.border, gap: 14 }}>
          <View>
            <Txt style={{ fontWeight: '700', fontSize: 16 }}>{t.setPriceTitle}</Txt>
            <Txt style={{ color: colors.textMuted, marginTop: 4 }}>{t.setPriceDesc}</Txt>
          </View>
          <Field value={price} onChangeText={setPrice} keyboardType="number-pad" placeholder="0" autoFocus />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button label={t.skipPrice} variant="outline" onPress={onSkip} style={{ flex: 1 }} />
            <Button label={t.setAndStart} onPress={handleConfirm} style={{ flex: 1 }} />
          </View>
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default function SetupScreen({ state }) {
  const { t } = useLang()
  const {
    players, session,
    updateConfig, addPlayer, addPlayers,
    removePlayer, updatePlayerSkill, togglePlayerStatus, markAllBench,
    startSession,
  } = state

  const [configErrors, setConfigErrors] = useState([])
  const [showPricePrompt, setShowPricePrompt] = useState(false)

  if (!session) return null

  const bench = players.filter(p => p.status === STATUS.BENCH)
  const canStart = bench.length >= 4
  const { courts, maxRoundsPerPlayer, maxPlayers, fullRoundPrice = 0 } = session.config

  const getErrors = () => {
    const errs = []
    if (!courts || courts < 1) errs.push(t.errorNoCourts)
    if (!maxRoundsPerPlayer || maxRoundsPerPlayer < 1) errs.push(t.errorNoRounds)
    if (!maxPlayers || maxPlayers < 1) errs.push(t.errorNoMaxPlayers)
    if (!fullRoundPrice || fullRoundPrice <= 0) errs.push(t.errorNoPrice)
    return errs
  }

  const handleAddPlayer = async (name, skill) => {
    const errs = getErrors()
    if (errs.length > 0) { setConfigErrors(errs); return { error: 'config' } }
    return addPlayer(name, skill)
  }

  const handleAddPlayers = async (names, skill) => {
    const errs = getErrors()
    if (errs.length > 0) { setConfigErrors(errs); return { error: 'config' } }
    return addPlayers(names, skill)
  }

  const handleStart = () => {
    const errs = getErrors().filter(e => e !== t.errorNoPrice)
    if (errs.length > 0) { setConfigErrors(errs); return }
    if (fullRoundPrice === 0) { setShowPricePrompt(true); return }
    startSession()
  }

  const handlePriceConfirm = async (price) => {
    if (price > 0) {
      await updateConfig(courts, maxRoundsPerPlayer, maxPlayers, price)
    }
    setShowPricePrompt(false)
    startSession()
  }

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
          <SessionConfig config={session.config} onUpdate={updateConfig} />

          {configErrors.length > 0 && (
            <ConfigErrorAlert errors={configErrors} onDismiss={() => setConfigErrors([])} />
          )}

          <AddPlayer
            onAdd={handleAddPlayer}
            onAddBulk={handleAddPlayers}
            maxPlayers={session.config.maxPlayers}
          />

          {players.length > 0 && (
            <PlayerList
              players={players}
              maxPlayers={session.config.maxPlayers}
              onSkillChange={updatePlayerSkill}
              onToggle={togglePlayerStatus}
              onRemove={removePlayer}
              onMarkAllBench={markAllBench}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ borderTopWidth: 1, borderTopColor: colors.borderSoft, padding: 12, backgroundColor: colors.bg }}>
        <Button
          label={canStart ? t.startReady(bench.length) : t.needPlayers(bench.length)}
          onPress={handleStart}
          disabled={!canStart}
        />
      </View>

      {showPricePrompt && (
        <PricePrompt
          onConfirm={handlePriceConfirm}
          onSkip={() => { setShowPricePrompt(false); startSession() }}
        />
      )}
    </View>
  )
}
