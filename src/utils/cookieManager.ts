import Cookies from 'js-cookie'

class CookieManager {
  private static getDomain(): string {
    return window.location.hostname === 'localhost' ? 'localhost' : import.meta.env.VITE_COOKIES_URL
  }

  private static getCookieOptions(expires?: number) {
    return {
      domain: this.getDomain(),
      expires: expires ? new Date(expires) : undefined,
      secure: window.location.protocol === 'https:',
      sameSite: 'strict' as const,
    }
  }

  static setItem(name: string, value: string, expires = Date.now() + 30 * 24 * 60 * 60 * 1000) {
    Cookies.set(name, value, this.getCookieOptions(expires))
  }

  static getItem(name: string): string | undefined {
    return Cookies.get(name)
  }

  static removeItem(name: string) {
    Cookies.remove(name, { domain: this.getDomain() })
  }

  static clear() {
    const cookies = Object.keys(Cookies.get())
    for (const cookie of cookies) {
      Cookies.remove(cookie, { domain: this.getDomain() })
    }
  }

  static getAll() {
    return Cookies.get()
  }

  // Auth-specific helper methods
  static setAuthTokens(
    accessToken: string,
    refreshToken: string,
    accessExpiry?: number,
    refreshExpiry?: number,
  ) {
    const defaultAccessExpiry = Date.now() + 60 * 60 * 1000 // 1 hour
    const defaultRefreshExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days

    this.setItem('accessToken', accessToken, accessExpiry || defaultAccessExpiry)
    this.setItem('refreshToken', refreshToken, refreshExpiry || defaultRefreshExpiry)
  }

  static getAuthTokens() {
    return {
      accessToken: this.getItem('accessToken'),
      refreshToken: this.getItem('refreshToken'),
    }
  }

  static clearAuthTokens() {
    this.removeItem('accessToken')
    this.removeItem('refreshToken')
    this.removeItem('userData')
  }

  static hasValidTokens(): boolean {
    const { accessToken, refreshToken } = this.getAuthTokens()
    return !!(accessToken || refreshToken)
  }
}

export default CookieManager
