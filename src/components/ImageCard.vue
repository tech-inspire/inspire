<template>
  <div class="image-card" @click="emit('open', props.image.postId)">
    <img :src="imageSrc" :class="{ loading: isLoading }" @load="handleImageLoad" />

    <!--    <p>Similarity: {{ similarityPercentage }}%</p>-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ image: { postId: string; image_path: string; distance: number } }>()
const emit = defineEmits<{ (e: 'open', id: string): void }>()

const imageSrc = computed(() => props.image.image_path)
// const similarityPercentage = computed(() => (100 - props.image.distance * 100).toFixed(2))

const isLoading = ref(true)

function handleImageLoad() {
  isLoading.value = false
}
</script>

<style scoped>
.image-card {
  width: 100%; /* Let the grid column define the width */
  padding: 20px;
  font-family: 'Merchant Copy', monospace;
  color: #111;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: left;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.image-card:hover {
  transform: scale(1.02);
}

.image-card img.loading {
  filter: blur(10px);
  transition: filter 0.4s ease;
}

.image-card img {
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: 12px;
  border-radius: 4px;
}

@font-face {
  font-family: 'Merchant Copy Doublesize';
  src: url('/merchant-copy/merchant-copy-doublesize.ttf');
}

.image-card p {
  font-family: 'San Francisco';
  font-size: 1rem;
  color: #111;
  //margin-top: 0.5rem;
  //white-space: pre-wrap;
}
</style>
