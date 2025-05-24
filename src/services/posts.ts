import { transport } from './api.ts'

import type {
  GetPostByIDResponse,
  GetPostsResponse,
  AddPostResponse,
  GetUploadUrlResponse,
} from 'inspire-api-contracts/api/gen/ts/posts/v1/posts_pb.ts'

import { mapPost } from '@/mappers/postsMapper.ts'
import type { Post, UploadUrl } from '../models/Post'
import { createClient } from '@connectrpc/connect'
import { PostsService } from 'inspire-api-contracts/api/gen/ts/posts/v1/posts_pb.ts'

function assertPostExists(post: unknown): asserts post is NonNullable<typeof post> {
  if (!post) {
    throw new Error('Expected post to be present in response but got undefined')
  }
}

const postsClient = createClient(PostsService, transport)

export async function addPost(input: {
  uploadSessionKey: string
  imageWidth: number
  imageHeight: number
  imageSize: number
  description: string
  soundcloudSong?: string
  soundcloudSongStart?: number
}): Promise<Post> {
  const response = (await postsClient.addPost(input)) as AddPostResponse
  assertPostExists(response.post)
  return mapPost(response.post)
}

export async function getPostByID(id: string): Promise<Post> {
  const response = (await postsClient.getPostByID({ postId: id })) as GetPostByIDResponse
  assertPostExists(response.post)
  return mapPost(response.post)
}

export async function getPostsByIDs(ids: string[]): Promise<Post[]> {
  const response = (await postsClient.getPosts({ postIds: ids })) as GetPostsResponse
  return response.posts.map(mapPost)
}

export async function deletePost(id: string): Promise<void> {
  await postsClient.deletePost({ postId: id })
}

export async function getUploadUrl(mimeType: string, fileSize: number): Promise<UploadUrl> {
  const response = (await postsClient.getUploadUrl({
    mimeType,
    fileSize,
  })) as GetUploadUrlResponse

  return {
    uploadUrl: response.uploadUrl,
    uploadSessionKey: response.uploadSessionKey,
    method: response.method,
    headers: response.headers,
  }
}
