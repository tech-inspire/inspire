// services/api.ts
import { createConnectTransport } from '@connectrpc/connect-web'
import { createClient } from '@connectrpc/connect'
import { AuthService } from 'inspire-api-contracts/api/gen/ts/auth/v1/auth_pb.js'
import { authInterceptor } from './interceptor.ts'

export const transport = createConnectTransport({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:7080',
  interceptors: [authInterceptor],
})

export const authClient = createClient(AuthService, transport)
