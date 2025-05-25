// services/authCookies.ts
import CookieManager from '@/utils/cookieManager.ts'
import type { AuthSession, User } from '@/models/User.ts'
import { useUserStore } from '@/stores/useUserStore'

export function setAuthTokens(authSession: AuthSession): void {
  CookieManager.setItem(
    'accessToken',
    authSession.accessToken,
    authSession.accessTokenExpiresAt.getTime(),
  )
  CookieManager.setItem(
    'refreshToken',
    authSession.refreshToken,
    authSession.refreshTokenExpiresAt.getTime(),
  )
  CookieManager.setItem(
    'userData',
    JSON.stringify(authSession.user),
    authSession.refreshTokenExpiresAt.getTime(),
  )

  const userStore = useUserStore()
  userStore.setUser(authSession.user)
}

export function clearAuthTokens(): void {
  CookieManager.clearAuthTokens()
}

export function getUserData(): User | null {
  const str = CookieManager.getItem('userData')
  if (!str) return null
  try {
    return JSON.parse(str) as User
  } catch {
    console.warn('Failed to parse userData')
    return null
  }
}
