import { View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { colors, skillColors } from '../../lib/theme.js'
import { Card, Divider, Txt } from '../ui.js'

function TeamList({ label, players }) {
  return (
    <View style={{ flex: 1 }}>
      <Txt style={{ color: colors.textDim, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</Txt>
      {players.map(p => (
        <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 1 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: (skillColors[p.skill] ?? skillColors.C).fg }} />
          <Txt numberOfLines={1} style={{ flexShrink: 1 }}>{p.name}</Txt>
        </View>
      ))}
    </View>
  )
}

export default function CourtCodeCard({ court }) {
  const { code, courtName, courtNumber, teamA = [], teamB = [], scoreConfig = {} } = court

  return (
    <Card style={{ borderWidth: 1, borderColor: colors.borderSoft, gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Txt style={{ color: colors.textMuted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Court {courtName ?? courtNumber}
        </Txt>
        <Txt style={{ color: colors.textDim, fontSize: 12 }}>
          {scoreConfig.numberOfGames} games · to {scoreConfig.pointsToWin}
          {scoreConfig.deuceRule ? ` · deuce ${scoreConfig.maxPoints}` : ''}
        </Txt>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Txt style={{ color: colors.textDim, fontSize: 12, marginBottom: 4 }}>Judge Code</Txt>
          <Txt selectable style={{ fontSize: 42, fontWeight: '900', letterSpacing: 4, color: colors.accent }}>{code}</Txt>
        </View>
        <View style={{ backgroundColor: '#fff', padding: 8, borderRadius: 12 }}>
          <QRCode value={code} size={80} ecl="M" />
        </View>
      </View>

      <Divider />

      <View style={{ flexDirection: 'row', gap: 16 }}>
        <TeamList label="Team A" players={teamA} />
        <View style={{ width: 1, backgroundColor: colors.borderSoft }} />
        <TeamList label="Team B" players={teamB} />
      </View>
    </Card>
  )
}
