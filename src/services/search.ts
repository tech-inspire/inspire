import { mapSearchResult } from '@/mappers/searchMapper.ts'

import { createClient } from '@connectrpc/connect'
import { SearchService } from 'inspire-api-contracts/api/gen/ts/search/v1/search_pb.ts'
import type { SearchImagesResponse } from 'inspire-api-contracts/api/gen/ts/search/v1/search_pb.ts'

import type { SearchResult } from '@/models/SearchResult.ts'
import { transport } from '@/services/api.ts'

const searchService = createClient(SearchService, transport)

export async function searchPostsByPostID(
  postID: string,
  limit: number,
  offset: number,
): Promise<SearchResult[]> {
  const resulsts = (await searchService.searchPosts({
    searchBy: {
      case: 'referencePostId',
      value: postID,
    },
    offset: offset,
    limit: limit,
  })) as SearchImagesResponse

  return resulsts.results.map(mapSearchResult)
}

export async function searchPostsByUserID(
  userID: string,
  limit: number,
  offset: number,
): Promise<SearchResult[]> {
  const resulsts = (await searchService.searchPosts({
    authorId: userID,
    offset: offset,
    limit: limit,
  })) as SearchImagesResponse

  return resulsts.results.map(mapSearchResult)
}

export async function searchPostsByText(
  text: string,
  limit: number,
  offset: number,
): Promise<SearchResult[]> {
  const resulsts = (await searchService.searchPosts({
    searchBy: {
      case: 'textQuery',
      value: text,
    },
    offset: offset,
    limit: limit,
  })) as SearchImagesResponse

  return resulsts.results.map(mapSearchResult)
}

export async function searchRandomPosts(limit: number, offset: number): Promise<SearchResult[]> {
  const resulsts = (await searchService.searchPosts({
    offset: offset,
    limit: limit,
  })) as SearchImagesResponse

  return resulsts.results.map(mapSearchResult)
}
