import { type SearchResult as ProtoSearchResult } from 'inspire-api-contracts/api/gen/ts/search/v1/search_pb.ts'
import type { SearchResult } from '../models/SearchResult.ts'

export function mapSearchResult(proto: ProtoSearchResult): SearchResult {
  return {
    postId: proto.postId,
    score: proto.similarity,
    image_path: `${import.meta.env.VITE_IMAGE_BASE_PATH}images/post_${proto.postId}`,
  }
}
