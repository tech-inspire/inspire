// services/interceptor.ts
import { createConnectTransport } from '@connectrpc/connect-web'
import { createClient, Code, ConnectError, type Interceptor } from '@connectrpc/connect'
import {
  AuthService,
  type RefreshTokenRequest,
} from 'inspire-api-contracts/api/gen/ts/auth/v1/auth_pb.js'
import { setAuthTokens, clearAuthTokens } from './authCookies.ts'
import CookieManager from '@/utils/cookieManager.ts'
import router from '@/router'
import { mapAuthSession } from '@/mappers/authMapper'

const noAuthTransport = createConnectTransport({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:7080',
  interceptors: [],
})
const noAuthClient = createClient(AuthService, noAuthTransport)

export const authInterceptor: Interceptor = (next) => async (req) => {
  const at = CookieManager.getItem('accessToken')
  if (at) req.header.set('Authorization', `Bearer ${at}`)
  console.log('inside interceptor')
  try {
    return await next(req)
  } catch (err) {
    if (ConnectError.from(err).code === Code.Unauthenticated) {
      console.log('trying refresh here')
      const rt = CookieManager.getItem('refreshToken')
      if (!rt) {
        clearAuthTokens()
        throw err
      }
      try {
        console.log('trying refresh', rt)
        // call refresh on the no-auth client
        const raw = (await noAuthClient.refreshToken({ refreshToken: rt })) as RefreshTokenRequest
        const session = mapAuthSession(raw)
        setAuthTokens(session)
        req.header.set('Authorization', `Bearer ${session.accessToken}`)
        return await next(req)
      } catch (refreshErr) {
        if (ConnectError.from(refreshErr).code === Code.Unauthenticated) {
          clearAuthTokens()
          await router.push('/login')
        }
        throw refreshErr
      }
    }
    throw err
  }
}
