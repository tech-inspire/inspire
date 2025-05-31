import type {
  User as ProtoUser,
  SuccessLoginResponse,
} from 'inspire-api-contracts/api/gen/ts/auth/v1/auth_pb'
import type { User, AuthSession } from '../models/User'
import { timestampDate } from '@bufbuild/protobuf/wkt'

export function mapUser(proto: ProtoUser): User {
  return {
    id: proto.id,
    username: proto.username?.value || 'unknown',
    name: proto.name?.value || 'unknown user',
    avatarUrl: proto.avatarUrl || undefined,
    description: proto.description,
  }
}

export function mapAuthSession(proto: SuccessLoginResponse): AuthSession {
  if (!proto.user) {
    throw new Error('SuccessLoginResponse.user is missing')
  }
  if (!proto.accessTokenExpiresAt) {
    throw new Error('SuccessLoginResponse.accessTokenExpiresAt is missing')
  }
  if (!proto.refreshTokenExpiresAt) {
    throw new Error('SuccessLoginResponse.refreshTokenExpiresAt is missing')
  }

  return {
    accessToken: proto.accessToken,
    accessTokenExpiresAt: timestampDate(proto.accessTokenExpiresAt),
    refreshToken: proto.refreshToken,
    refreshTokenExpiresAt: timestampDate(proto.refreshTokenExpiresAt),
    user: mapUser(proto.user),
  }
}
