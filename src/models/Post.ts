export interface ImageVariant {
  url: string
  width: number
  height: number
  size: number
  variantType: 'ORIGINAL' | 'THUMBNAIL'
}

export interface Post {
  postId: string
  authorId: string
  images: ImageVariant[]
  soundcloudSong?: string
  soundcloudSongStart?: number
  description: string
  createdAt: Date
}

export interface UploadUrl {
  uploadUrl: string
  uploadSessionKey: string
  method?: string
  headers?: Record<string, string>
}
