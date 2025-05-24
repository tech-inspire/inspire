import { authClient } from './api.ts'
import type {
  SuccessLoginResponse,
  RegisterResponse,
  GetUserResponse,
} from 'inspire-api-contracts/api/gen/ts/auth/v1/auth_pb.js'

import { mapAuthSession, mapUser } from '../mappers/authMapper'
import type { AuthSession, User } from '../models/User.ts'
import { setAuthTokens } from './authCookies.ts'
import { Code, ConnectError } from '@connectrpc/connect'
import CookieManager from '@/utils/cookieManager.ts'

export async function login(
  login: { username?: string; email?: string },
  password: string,
): Promise<AuthSession> {
  if (!login.username && !login.email) {
    throw new Error('Either username or email must be provided')
  }

  try {
    const response = (await authClient.login({
      login: login.username
        ? { case: 'username', value: { value: login.username } }
        : { case: 'email', value: { value: login.email! } },
      password,
    })) as SuccessLoginResponse

    const authSession = mapAuthSession(response)
    setAuthTokens(authSession)
    return authSession
  } catch (error) {
    const connectErr = ConnectError.from(error)

    if (connectErr.code === Code.PermissionDenied || connectErr.code === Code.Aborted) {
      throw new Error('Invalid username or password')
    }

    throw error
  }
}

export type RegisterSuccess = {
  type: 'success'
  session: AuthSession
}

export type RegisterEmailConfirmationRequired = {
  type: 'emailConfirmationRequired'
}

export type RegisterResult = RegisterSuccess | RegisterEmailConfirmationRequired

export async function register(input: {
  email: string
  username: string
  name: string
  password: string
}): Promise<RegisterResult> {
  // Call the generated client, passing a plain object (JSON mode) or a `create()`d request
  const res = (await authClient.register({
    email: {
      value: input.email,
    },
    username: {
      value: input.username,
    },
    password: {
      value: input.password,
    },
    name: {
      value: input.name,
    },
  })) as RegisterResponse

  switch (res.flow?.case) {
    case 'loginResponse':
      return {
        type: 'success',
        session: mapAuthSession(res.flow.value),
      }
    default:
      return {
        type: 'emailConfirmationRequired',
      }
  }
}

export async function refreshToken(refreshToken: string): Promise<AuthSession> {
  const resp = (await authClient.refreshToken({ refreshToken })) as SuccessLoginResponse

  const authSession = mapAuthSession(resp)
  setAuthTokens(authSession)

  return authSession
}

export async function logout(): Promise<void> {
  const token = CookieManager.getItem('refreshToken')
  if (token) {
    await authClient.logout({ refreshToken: token })
  }

  CookieManager.clearAuthTokens()
}

export async function resetPassword(email: string): Promise<void> {
  await authClient.resetPassword({ email })
}

export async function checkPasswordResetCode(email: string, code: string): Promise<void> {
  await authClient.checkPasswordResetCode({ email, code })
}

export async function confirmPasswordReset(
  email: string,
  code: string,
  password: string,
): Promise<void> {
  await authClient.confirmPasswordReset({ email, code, password })
}

export async function confirmEmail(email: string, code: string): Promise<void> {
  try {
    const response = (await authClient.confirmEmail({
      email: {
        value: email,
      },
      code: {
        value: code,
      },
    })) as SuccessLoginResponse

    const authSession = mapAuthSession(response)
    setAuthTokens(authSession)
  } catch (error) {
    const connectErr = ConnectError.from(error)

    console.dir(connectErr)
    throw new Error(connectErr.rawMessage)
  }
}

export async function getMe(): Promise<User> {
  const resp = (await authClient.getMe({})) as GetUserResponse
  if (!resp.user) {
    throw new Error('GetUserResponse.user is missing')
  }
  return mapUser(resp.user)
}

export async function getUserByID(id: string): Promise<User> {
  const resp = (await authClient.getUser({ id })) as GetUserResponse
  if (!resp.user) {
    throw new Error('GetUserResponse.user is missing')
  }
  return mapUser(resp.user)
}

export async function uploadAvatar(contentType: string, content: Uint8Array): Promise<void> {
  await authClient.uploadAvatar({ contentType, content })
}
