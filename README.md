# Match Minton — mobile

React Native (Expo + expo-router) client for the Match Minton Spring Boot backend. Port of the `match-minton` web app: iOS and Android from one codebase.

## Run

```bash
cp .env.example .env     # set EXPO_PUBLIC_API_URL (see below)
npm install
npx expo start           # press i (iOS simulator), a (Android emulator), or scan the QR in Expo Go
```

Start the backend first (`./mvnw spring-boot:run` in the `badminton` repo, port 8081).

**API URL:** `localhost` on a phone is the phone itself. On a physical device set `EXPO_PUBLIC_API_URL=http://<your-computer-LAN-IP>:8081`. Without it, the iOS simulator uses `localhost` and the Android emulator uses `10.0.2.2`. Release builds need an `https://` URL.

## Screens (`src/app`)

| Route | Who | What |
|---|---|---|
| `/` | Organizer | Login/sign-up, then setup → live session (courts/bench/waiting/done/history/compete) → summary |
| `/judge` | Public | Enter the 4-character court code |
| `/judge/[code]` | Public | Live scoring with undo, winner banner + result QR |
| `/result/[courtId]` | Public | Shareable result card (Pro) |

## Layout

- `src/hooks`, `src/services`, `src/models`, `src/lib/i18n.js` — shared logic, near-identical to the web app (storage swapped for SecureStore/AsyncStorage)
- `src/components` — native UI (`StyleSheet`, no Tailwind)

## Ship

```bash
npx eas-cli@latest build --platform all     # cloud builds
npx eas-cli@latest submit --platform all    # App Store / Play Store
```

Bundle ids are `com.matchminton.app` (change in `app.json` before publishing).
