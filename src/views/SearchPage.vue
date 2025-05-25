<template>
  <div style="text-align: center">
    <h1 v-if="searchQuery.searchQuery.length > 0">
      Inspire me. Like {{ searchQuery.searchQuery }}!
    </h1>
    <h1 v-else>Inspire me.</h1>
  </div>

  <div class="gallery">
    <TransitionGroup name="fade" tag="div" class="gallery-inner">
      <ImageCard v-for="image in images" :key="image.image_path" :image="image" @open="openPost" />
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useSearchStore } from '@/stores/useSearchStore'
import { useDebounceFn } from '@vueuse/core'
import ImageCard from '../components/ImageCard.vue'
import { searchPostsByText } from '@/services/search.ts'
import type { SearchResult } from '@/models/SearchResult.ts'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'

const page = ref(0)
const pageSize = 20
const hasMore = ref(true)
const isLoading = ref(false)

interface Image {
  postId: string
  image_path: string
  distance: number
}

export default defineComponent({
  name: 'SearchPage',
  components: {
    ImageCard,
  },
  setup() {
    const searchQuery = useSearchStore()
    const route = useRoute()
    const router = useRouter()

    // Predefined fallback queries
    const fallbackQueries = [
      'black cats',
      'sunset beach',
      'neon city',
      'vintage cars',
      'abstract art',
      'rainy window',
      'mountain landscape',
      'street photography',
      'retro tech',
      'night sky',
    ]

    // If user supplied a query in URL (?q=...), use it
    if (route.query.q) {
      searchQuery.searchQuery = route.query.q as string
    }

    // Otherwise, use a random fallback
    if (!searchQuery.searchQuery) {
      const randomIndex = Math.floor(Math.random() * fallbackQueries.length)
      searchQuery.searchQuery = fallbackQueries[randomIndex]
    }

    // Run the search
    if (searchQuery.searchQuery) {
      searchImages()
    }

    const images = ref<Image[]>([])
    const file = ref<File | null>(null)
    const selectedImage = ref<Image | null>(null)

    const debouncedSearchImages = useDebounceFn((reset = false) => {
      searchImages(reset)
    }, 500)

    async function searchImages(reset = false) {
      if (isLoading.value || !searchQuery.searchQuery) return

      isLoading.value = true
      if (reset) {
        page.value = 0
        images.value = []
        hasMore.value = true
      }

      await router.replace({ query: { q: searchQuery.searchQuery } })

      const res = await searchPostsByText(searchQuery.searchQuery, pageSize, page.value * pageSize)

      const newImages = res.map((m: SearchResult) => ({
        postId: m.postId,
        image_path: `${import.meta.env.VITE_IMAGE_BASE_PATH}images/post_${m.postId}`,
        distance: m.score ?? 0.0,
      }))

      if (newImages.length < pageSize) hasMore.value = false

      images.value.push(...newImages)
      page.value++
      isLoading.value = false
    }

    function handleScroll() {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300
      if (nearBottom && hasMore.value) {
        searchImages()
      }
    }

    const searchStore = useSearchStore()

    watch(searchStore, () => {
      debouncedSearchImages(true)
    })

    async function openPost(id: string) {
      await router.push({ name: 'PostPage', params: { postId: id }, query: { modal: '1' } })
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      searchQuery, // not used in template, but useful for debugging
      images,
      file,
      selectedImage,
      debouncedSearchImages,
      openPost,
      // setSelectedImage
    }
  },
})
</script>

<style scoped>
.gallery {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 0 1rem;
}

.gallery-inner {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1600px;
}

/* Transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

h1 {
  font-size: 2rem;
  margin-top: 20px;
}
</style>
