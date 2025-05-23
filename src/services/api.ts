import { createClient } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-web'
import { create } from '@bufbuild/protobuf'

// Auth imports stay the same…
import {
  AuthService,
  LoginRequestSchema,
} from 'inspire-api-contracts/api/gen/ts/auth/v1/auth_pb.ts'

import type { GetPostByIDResponse } from 'inspire-api-contracts/api/gen/ts/posts/v1/posts_pb.ts'

// Posts imports split into a value import and a type-only import:
import { PostsService } from 'inspire-api-contracts/api/gen/ts/posts/v1/posts_pb.ts'

import { SearchService } from 'inspire-api-contracts/api/gen/ts/search/v1/search_pb.ts'

const transport = createConnectTransport({
  baseUrl: 'http://localhost:7080',
  useBinaryFormat: true,
})

const authService = createClient(AuthService, transport)
export const postsService = createClient(PostsService, transport)
const searchService = createClient(SearchService, transport)
