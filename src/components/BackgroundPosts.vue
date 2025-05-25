<template>
  <div v-show="allImagesLoaded" class="background-grid fade-in">
    <img
      v-for="post in posts"
      :key="post.postId"
      class="background-image"
      :src="getImageSrcFromPostId(post.postId)"
      alt=""
      loading="eager"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { searchRandomPosts } from '@/services/search'
import type { SearchResult } from '@/models/SearchResult'
import { getImageSrcFromPostId } from '@/utils/imagePaths'

const posts = ref<SearchResult[]>([])
const allImagesLoaded = ref(false)

onMounted(async () => {
  try {
    const offset = Math.floor(Math.random() * 1000)
    posts.value = await searchRandomPosts(20, offset)

    await nextTick() // wait for DOM to render <img> tags

    const imgElements = document.querySelectorAll('.background-image')
    let loadedCount = 0
    const total = posts.value.length

    console.log(total)
    imgElements.forEach((img) => {
      img.addEventListener('load', check)
      img.addEventListener('error', check)
    })

    function check() {
      loadedCount++
      if (loadedCount === total) {
        allImagesLoaded.value = true
      }
    }
  } catch (e) {
    console.error('Failed to load images', e)
  }
})
</script>

<style scoped lang="scss">
.background-grid {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -25%) rotate(45deg);
  z-index: 0;
  width: 200%;
  height: 300%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 1fr;
  gap: 16px;
  pointer-events: none;
  opacity: 0.2;
  place-items: center;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(4px);
  border-radius: 8px;
}

.background-grid {
  opacity: 0.2;
  transition: opacity 0.8s ease;
}

.background-grid.loaded {
  opacity: 0.2;
}

.fade-in {
  animation: fadeIn 0.7s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.2;
  }
}
</style>
