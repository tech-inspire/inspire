import { postsService } from './api.ts'

import type {
  GetPostByIDResponse,
  GetPostsResponse,
  AddPostResponse,
  GetUploadUrlResponse,
} from 'inspire-api-contracts/api/gen/ts/posts/v1/posts_pb.ts'

import { mapPost } from './posts_mapper.ts'
import type { Post, UploadUrl } from '../models/Post'

function assertPostExists(post: unknown): asserts post is NonNullable<typeof post> {
  if (!post) {
    throw new Error('Expected post to be present in response but got undefined')
  }
}

export async function addPost(input: {
  uploadSessionKey: string
  imageWidth: number
  imageHeight: number
  imageSize: number
  description: string
  soundcloudSong?: string
  soundcloudSongStart?: number
}): Promise<Post> {
  const response = (await postsService.addPost(input)) as AddPostResponse
  assertPostExists(response.post)
  return mapPost(response.post)
}

export async function getPostByID(id: string): Promise<Post> {
  const response = (await postsService.getPostByID({ postId: id })) as GetPostByIDResponse
  assertPostExists(response.post)
  return mapPost(response.post)
}

export async function getPostsByIDs(ids: string[]): Promise<Post[]> {
  const response = (await postsService.getPosts({ postIds: ids })) as GetPostsResponse
  return response.posts.map(mapPost)
}

export async function deletePost(id: string): Promise<void> {
  await postsService.deletePost({ postId: id })
}

export async function getUploadUrl(mimeType: string, fileSize: number): Promise<UploadUrl> {
  const response = (await postsService.getUploadUrl({
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
