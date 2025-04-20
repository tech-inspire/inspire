import { createClient } from '@connectrpc/connect'
import {
  AuthService,
  LoginRequestSchema,
} from 'inspire-api-contracts/api/gen/ts/auth/v1/auth_pb.ts'
import { createConnectTransport } from '@connectrpc/connect-web'
import { ConnectError } from '@connectrpc/connect'
import { create } from '@bufbuild/protobuf'
import type { Message } from '@bufbuild/protobuf'

// This transport is going to be used throughout the app
const transport = createConnectTransport({
  baseUrl: 'http://localhost:7080',
})

const client = createClient(AuthService, transport)

const req = create(LoginRequestSchema, {
  login: {
    case: 'username',
    value: 'illiafox',
  },
  password: 'aboba',
})

export async function test() {
  const res = await client.login(req)
  console.log(res)
}
