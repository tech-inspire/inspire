import {
  type ImageVariant as ProtoVariant,
  type Post as ProtoPost,
  VariantType,
} from 'inspire-api-contracts/api/gen/ts/posts/v1/posts_pb'
import type { ImageVariant, Post } from '../models/Post'
import { timestampDate } from '@bufbuild/protobuf/wkt'

function mapVariant(proto: ProtoVariant): ImageVariant {
  return {
    url: proto.url,
    width: proto.width,
    height: proto.height,
    size: proto.size,
    variantType: proto.variantType === VariantType.ORIGINAL ? 'ORIGINAL' : 'THUMBNAIL',
  }
}

export function mapPost(proto: ProtoPost): Post {
  if (!proto.createdAt) {
    throw new Error('Post.createdAt is missing')
  }

  return {
    postId: proto.postId,
    authorId: proto.authorId,
    images: proto.images.map(mapVariant),
    soundcloudSong: proto.soundcloudSong || undefined,
    soundcloudSongStart: proto.soundcloudSongStart ?? undefined,
    description: proto.description,
    createdAt: timestampDate(proto.createdAt),
  }
}
