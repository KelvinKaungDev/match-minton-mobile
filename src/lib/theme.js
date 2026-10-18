// Palette mirrors the web app's Tailwind stone/emerald scheme.
export const colors = {
  bg: '#0c0a09',        // stone-950
  card: '#1c1917',      // stone-900
  cardAlt: '#292524',   // stone-800
  border: '#44403c',    // stone-700
  borderSoft: '#292524',
  text: '#ffffff',
  textMuted: '#a8a29e', // stone-400
  textDim: '#78716c',   // stone-500
  textFaint: '#57534e', // stone-600
  accent: '#34d399',
  accentPressed: '#6ee7b7',
  onAccent: '#0f1923',
  sky: '#38bdf8',
  amber: '#fbbf24',
  yellow: '#facc15',
  red: '#f87171',
  purple: '#c084fc',
  teal: '#2dd4bf',
}

// Translucent tints (Tailwind's bg-x/20 equivalents)
export const tints = {
  sky: 'rgba(14,165,233,0.2)',
  yellow: 'rgba(234,179,8,0.2)',
  red: 'rgba(239,68,68,0.2)',
  purple: 'rgba(168,85,247,0.2)',
  amber: 'rgba(245,158,11,0.2)',
  teal: 'rgba(20,184,166,0.2)',
  stone: 'rgba(120,113,108,0.2)',
  emerald: 'rgba(16,185,129,0.15)',
  accent: 'rgba(52,211,153,0.15)',
}

export const skillColors = {
  S: { bg: tints.amber, fg: colors.amber },
  A: { bg: tints.sky, fg: colors.sky },
  B: { bg: tints.teal, fg: colors.teal },
  C: { bg: tints.stone, fg: colors.textMuted },
}
