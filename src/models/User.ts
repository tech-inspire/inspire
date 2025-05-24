export interface User {
  id: string
  username: string
  name: string
  avatarUrl?: string
  description: string
}

export interface AuthSession {
  accessToken: string
  accessTokenExpiresAt: Date
  refreshToken: string
  refreshTokenExpiresAt: Date
  user: User
}
