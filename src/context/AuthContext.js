import { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api, loadToken, setToken, setUnauthorizedHandler } from '../services/apiClient.js'

const AuthContext = createContext()
const USER_KEY = 'mm_user'

async function readStoredUser() {
  const raw = await AsyncStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function storeSession(authResponse) {
  await setToken(authResponse.token)
  const user = { uid: authResponse.id, id: authResponse.id, name: authResponse.name, email: authResponse.email }
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = still loading

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const token = await loadToken()
        const stored = token ? await readStoredUser() : null
        if (!cancelled) setUser(stored)
      } catch {
        if (!cancelled) setUser(null)
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null).catch(() => {})
      AsyncStorage.removeItem(USER_KEY).catch(() => {})
      setUser(null)
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    setUser(await storeSession(res))
  }

  const signup = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password })
    setUser(await storeSession(res))
  }

  const logout = async () => {
    await setToken(null)
    await AsyncStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
