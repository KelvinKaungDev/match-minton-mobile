import { useAuth } from '../context/AuthContext.js'
import AuthScreen from '../components/AuthScreen.js'
import OrganizerApp from '../components/OrganizerApp.js'
import { Loading } from '../components/ui.js'

// Organizer entry: log in, then setup -> session -> summary (driven by the backend's session.screen).
export default function Home() {
  const { user } = useAuth()

  if (user === undefined) return <Loading label="Loading..." />
  if (!user) return <AuthScreen />
  return <OrganizerApp />
}
