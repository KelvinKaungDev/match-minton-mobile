import { Pressable, View } from 'react-native'
import { colors } from '../../lib/theme.js'
import { Txt } from '../ui.js'

function TeamButton({ label, players, color, bg, border, onScore, disabled }) {
  return (
    <Pressable
      onPress={onScore}
      disabled={disabled}
      style={({ pressed }) => ({
        flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 32,
        borderRadius: 16, borderWidth: 2, borderColor: border,
        backgroundColor: bg,
        opacity: disabled ? 0.4 : pressed ? 0.6 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      })}
    >
      <Txt style={{ fontSize: 44, fontWeight: '900', color }}>+1</Txt>
      <Txt style={{ fontWeight: '700', letterSpacing: 0.5 }}>{label}</Txt>
      <View style={{ alignItems: 'center', paddingHorizontal: 6 }}>
        {players.map((p, i) => (
          <Txt key={p.id ?? i} numberOfLines={1} style={{ color: colors.textMuted, fontSize: 12 }}>{p.name}</Txt>
        ))}
      </View>
    </Pressable>
  )
}

export default function ScoreControl({ teamA = [], teamB = [], onScore, onUndo, canUndo, disabled }) {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TeamButton
          label="Team A" players={teamA} color="#34d399"
          bg="rgba(16,185,129,0.15)" border="rgba(16,185,129,0.3)"
          onScore={() => onScore('teamA')} disabled={disabled}
        />
        <TeamButton
          label="Team B" players={teamB} color={colors.sky}
          bg="rgba(14,165,233,0.15)" border="rgba(14,165,233,0.3)"
          onScore={() => onScore('teamB')} disabled={disabled}
        />
      </View>
      <Pressable
        onPress={onUndo}
        disabled={!canUndo}
        style={{ paddingVertical: 12, borderRadius: 12, backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border, alignItems: 'center', opacity: canUndo ? 1 : 0.3 }}
      >
        <Txt style={{ color: '#d6d3d1', fontWeight: '500' }}>↶  Undo Last Point</Txt>
      </Pressable>
    </View>
  )
}
