import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { useLang } from '../../context/LangContext.js'
import { colors } from '../../lib/theme.js'
import { Button, Txt } from '../ui.js'
import CompetitionSetup from '../competition/CompetitionSetup.js'
import SessionHeader from './SessionHeader.js'
import CourtsTab from './CourtsTab.js'
import BenchTab from './BenchTab.js'
import WaitingTab from './WaitingTab.js'
import DoneTab from './DoneTab.js'
import HistoryTab from './HistoryTab.js'

const TAB_KEYS = ['courts', 'bench', 'waiting', 'done', 'history', 'compete']

export default function SessionScreen({ state }) {
  const { t } = useLang()
  const { players, session, courts, markLeave, activatePlayer, volunteerMore, fillEmptyCourts, completeCourt, refillCourt, swapPlayers, addWalkIn, endSession } = state
  const [tabKey, setTabKey] = useState('courts')

  if (!session) return null

  const TAB_LABELS = {
    courts: t.tabCourts,
    bench: t.tabBench,
    waiting: t.tabWaiting,
    done: t.tabDone,
    history: t.tabHistory,
    compete: t.tabCompete,
  }

  return (
    <View style={{ flex: 1 }}>
      <SessionHeader players={players} />

      <View style={{ borderBottomWidth: 1, borderBottomColor: colors.borderSoft }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TAB_KEYS.map(key => (
            <Pressable
              key={key}
              onPress={() => setTabKey(key)}
              style={{ paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: tabKey === key ? colors.accent : 'transparent' }}
            >
              <Txt style={{ fontWeight: '500', color: tabKey === key ? colors.accent : colors.textDim }}>{TAB_LABELS[key]}</Txt>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }}>
        {tabKey === 'courts' && <CourtsTab courts={courts} onLeave={markLeave} onComplete={completeCourt} onRefill={refillCourt} onSwap={swapPlayers} players={players} />}
        {tabKey === 'history' && <HistoryTab history={session.history ?? []} />}
        {tabKey === 'bench' && <BenchTab players={players} session={session} onLeave={markLeave} onFillCourts={fillEmptyCourts} onWalkIn={addWalkIn} />}
        {tabKey === 'waiting' && <WaitingTab players={players} onActivate={activatePlayer} />}
        {tabKey === 'done' && <DoneTab players={players} session={session} onVolunteer={volunteerMore} />}
        {tabKey === 'compete' && <View style={{ padding: 16 }}><CompetitionSetup courts={courts} /></View>}
      </ScrollView>

      <View style={{ borderTopWidth: 1, borderTopColor: colors.borderSoft, padding: 12, backgroundColor: colors.bg }}>
        <Button label={t.endSession} variant="secondary" onPress={endSession} style={{ paddingVertical: 11 }} />
      </View>
    </View>
  )
}
