import type { Post } from '@/models/Post'

const BASE = import.meta.env.VITE_IMAGE_BASE_PATH

export function resolveImagePath(path?: string | null): string {
  return path ? `${BASE}${path}` : ''
}

export function getAvatarSrc(avatarUrl?: string | null): string {
  return resolveImagePath(avatarUrl)
}

export function getMainImageSrc(image: { url: string } | null | undefined): string {
  return resolveImagePath(image?.url)
}

export function getImageSrcFromPostId(id: string): string {
  return `${BASE}images/post_${id}`
}

export function getThumbnailSrc(post: Post): string {
  const img = post.images.find((i) => i.variantType === 'THUMBNAIL') ?? post.images[0]
  return resolveImagePath(img?.url)
}
