import { ActivityIndicator, Pressable, Text, TextInput, View, StyleSheet } from 'react-native'
import { colors, tints, skillColors } from '../lib/theme.js'
import { SKILLS } from '../models/index.js'

// Text with the app's default colour; pass `style` to override.
export function Txt({ style, ...props }) {
  return <Text {...props} style={[styles.txt, style]} />
}

export function Card({ style, ...props }) {
  return <View {...props} style={[styles.card, style]} />
}

export function Loading({ label }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.accent} />
      {label ? <Txt style={{ color: colors.textMuted, fontSize: 13, marginTop: 10 }}>{label}</Txt> : null}
    </View>
  )
}

export function Empty({ children }) {
  return <Txt style={styles.empty}>{children}</Txt>
}

// Primary / secondary / ghost full-size buttons.
export function Button({ label, onPress, disabled, loading, variant = 'primary', style }) {
  const isPrimary = variant === 'primary'
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        isPrimary ? styles.btnPrimary : variant === 'outline' ? styles.btnOutline : styles.btnSecondary,
        pressed && { opacity: 0.8 },
        (disabled || loading) && (isPrimary ? styles.btnPrimaryDisabled : { opacity: 0.4 }),
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={isPrimary ? colors.onAccent : colors.textMuted} />
        : (
          <Txt style={[
            styles.btnLabel,
            isPrimary ? { color: disabled ? colors.textFaint : colors.onAccent } : { color: colors.textMuted },
          ]}>
            {label}
          </Txt>
        )}
    </Pressable>
  )
}

// Small translucent action chip (Bench / Leave / Swap ...).
const chipPalette = {
  sky: { bg: tints.sky, fg: colors.sky },
  yellow: { bg: tints.yellow, fg: colors.yellow },
  red: { bg: tints.red, fg: colors.red },
  purple: { bg: tints.purple, fg: colors.purple },
  amber: { bg: tints.amber, fg: colors.amber },
  teal: { bg: tints.teal, fg: colors.teal },
  accent: { bg: tints.accent, fg: colors.accent },
  stone: { bg: colors.cardAlt, fg: colors.textMuted },
}

export function Chip({ label, tone = 'stone', onPress, disabled, small, active, style }) {
  const c = chipPalette[tone]
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      style={({ pressed }) => [
        styles.chip,
        small && styles.chipSmall,
        { backgroundColor: c.bg },
        active && { borderWidth: 1, borderColor: c.fg },
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      <Txt style={{ color: c.fg, fontSize: small ? 11 : 12, fontWeight: '600' }}>{label}</Txt>
    </Pressable>
  )
}

export function SkillBadge({ skill }) {
  const c = skillColors[skill] ?? skillColors.C
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Txt style={{ color: c.fg, fontSize: 12, fontWeight: '700' }}>{skill}</Txt>
    </View>
  )
}

export function SkillPicker({ value, onChange, compact }) {
  return (
    <View style={{ flexDirection: 'row', gap: compact ? 4 : 8 }}>
      {SKILLS.map(s => {
        const active = value === s
        return (
          <Pressable
            key={s}
            onPress={() => onChange(s)}
            style={[
              compact ? styles.skillSm : styles.skillBtn,
              { backgroundColor: active ? colors.accent : compact ? colors.border : colors.cardAlt },
            ]}
          >
            <Txt style={{ color: active ? colors.onAccent : colors.textMuted, fontWeight: '700', fontSize: compact ? 12 : 14 }}>
              {s}
            </Txt>
          </Pressable>
        )
      })}
    </View>
  )
}

export function Field(props) {
  return (
    <TextInput
      placeholderTextColor={colors.textDim}
      {...props}
      style={[styles.field, props.multiline && { textAlignVertical: 'top' }, props.style]}
    />
  )
}

export function Stepper({ label, hint, value, min, max, onChange }) {
  return (
    <View style={styles.rowBetween}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Txt style={{ color: colors.textMuted, fontSize: 14 }}>{label}</Txt>
        {hint ? <Txt style={{ color: colors.textDim, fontSize: 12, marginTop: 2 }}>{hint}</Txt> : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable
          onPress={() => onChange(value - 1)}
          disabled={value <= min}
          style={[styles.stepBtn, value <= min && { opacity: 0.3 }]}
        >
          <Txt style={styles.stepTxt}>−</Txt>
        </Pressable>
        <Txt style={{ fontWeight: '700', minWidth: 28, textAlign: 'center' }}>{value}</Txt>
        <Pressable
          onPress={() => onChange(value + 1)}
          disabled={value >= max}
          style={[styles.stepBtn, value >= max && { opacity: 0.3 }]}
        >
          <Txt style={styles.stepTxt}>+</Txt>
        </Pressable>
      </View>
    </View>
  )
}

export function Divider({ style }) {
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: colors.cardAlt }, style]} />
}

export function Dots({ won, needed, color }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: needed }).map((_, i) => (
        <View
          key={i}
          style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: i < won ? color : colors.border }}
        />
      ))}
    </View>
  )
}

export const styles = StyleSheet.create({
  txt: { color: colors.text, fontSize: 14 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  empty: { color: colors.textFaint, textAlign: 'center', paddingVertical: 48, paddingHorizontal: 16 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  btn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: colors.accent },
  btnPrimaryDisabled: { backgroundColor: colors.cardAlt },
  btnSecondary: { backgroundColor: colors.cardAlt },
  btnOutline: { borderWidth: 1, borderColor: colors.border },
  btnLabel: { fontSize: 15, fontWeight: '600' },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  chipSmall: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  skillBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  skillSm: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  field: {
    backgroundColor: colors.cardAlt,
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  stepBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.cardAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  stepTxt: { fontSize: 20, lineHeight: 22 },
})
