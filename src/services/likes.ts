import { transport } from './api.ts'

import { createClient } from '@connectrpc/connect'
import {
  type GetLikesCountResponse,
  type HasUserLikedPostResponse,
  LikesService,
} from 'inspire-api-contracts/api/gen/ts/likes/v1/likes_pb'

const likesClient = createClient(LikesService, transport)

export async function getPostLikesCount(id: string): Promise<bigint> {
  const response = (await likesClient.getLikesCount({ postId: id })) as GetLikesCountResponse
  return response.likesCount
}

export async function hasUserLikedPost(postId: string, userId: string): Promise<boolean> {
  const response = (await likesClient.hasUserLikedPost({
    postId: postId,
    userId: userId,
  })) as HasUserLikedPostResponse
  return response.liked
}

export async function likePost(postId: string): Promise<void> {
  await likesClient.likePost({ postId: postId })
}

export async function unlikePost(postId: string): Promise<void> {
  await likesClient.unlikePost({ postId: postId })
}
