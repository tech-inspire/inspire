<template>
  <div style="text-align: center">
    <h1 v-if="searchQuery.searchQuery.length > 0">
      Inspire me. Like these {{ searchQuery.searchQuery }}
    </h1>
    <h1 v-else>Inspire me.</h1>
  </div>

  <div class="gallery">
    <TransitionGroup name="fade" tag="div" class="gallery-inner">
      <ImageCard v-for="image in images" :key="image.image_path" :image="image" />
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useSearchStore } from '@/stores/useSearchStore'
import { useDebounceFn } from '@vueuse/core'
import apiService from '../services/apiService'
import ImageCard from '../components/ImageCard.vue'

interface Image {
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
    const images = ref<Image[]>([])
    const file = ref<File | null>(null)
    const selectedImage = ref<Image | null>(null)

    const debouncedSearchImages = useDebounceFn(searchImages, 500)

    async function searchImages() {
      if (!searchQuery.searchQuery && !file.value && !selectedImage.value) return

      const formData = new FormData()
      if (searchQuery.searchQuery) {
        formData.append('text', searchQuery.searchQuery)
      }

      if (file.value) {
        formData.append('image', file.value)
      }

      if (selectedImage.value) {
        try {
          const imageBlob = await apiService.getImageByPath(selectedImage.value.image_path)
          formData.append('image', imageBlob, 'image.jpg')
        } catch (error) {
          console.error('Error fetching image as blob:', error)
          return
        }
      }

      try {
        const startTime = performance.now()
        images.value = await apiService.findSimilarImages(formData)
        const endTime = performance.now()
        console.log(`Response in ${endTime - startTime} milliseconds`)
      } catch (error) {
        console.error('Error fetching similar images:', error)
      }
    }

    function handleFileUpload(event: Event) {
      const input = event.target as HTMLInputElement
      const uploadedFile = input?.files?.[0]
      if (uploadedFile) {
        file.value = uploadedFile
        searchImages()
      }
    }

    // function setSelectedImage(image: Image) {
    //   searchQuery.value = ''
    //   file.value = null
    //   selectedImage.value = image
    //   searchImages()
    // }

    const searchStore = useSearchStore()

    watch(searchStore, (newVal) => {
      console.log('test', searchQuery.searchQuery)
      if (newVal) {
        debouncedSearchImages()
      }
    })

    return {
      searchQuery, // not used in template, but useful for debugging
      images,
      file,
      selectedImage,
      debouncedSearchImages,
      handleFileUpload,
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
}

.gallery-inner {
  display: flex;
  //flex-wrap: wrap;
  gap: 20px;
}

/* Transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  //transform: translateY(20px);
}

h1 {
  font-size: 4rem;
}
</style>
