import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const DEFAULT_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8081' : 'http://localhost:8081'
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_URL
export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? 'https://match-minton.vercel.app'

const TOKEN_KEY = 'mm_token'

// SecureStore is async, so the token is mirrored in memory for synchronous reads.
let cachedToken = null

export async function loadToken() {
  cachedToken = await SecureStore.getItemAsync(TOKEN_KEY)
  return cachedToken
}

// Called when an authenticated request is rejected (expired/invalid token) so the app can sign out.
let onUnauthorized = null
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

export function getToken() {
  return cachedToken
}

export async function setToken(token) {
  cachedToken = token ?? null
  if (token) await SecureStore.setItemAsync(TOKEN_KEY, token)
  else await SecureStore.deleteItemAsync(TOKEN_KEY)
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (cachedToken) headers.Authorization = `Bearer ${cachedToken}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Could not reach the server. Check your connection.')
  }

  if (res.status === 401 && cachedToken && !path.startsWith('/api/auth/')) {
    onUnauthorized?.()
    throw new Error('Your session expired. Please log in again.')
  }

  if (res.status === 204) return null
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? `Request failed with status ${res.status}`)
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
