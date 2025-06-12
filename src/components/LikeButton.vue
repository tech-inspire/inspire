<template>
  <img
    :class="{ 'playing-icon': liked }"
    class="play-icon"
    @click="toggleLike"
    :src="liked ? FilledHeart : EmptyHeart"
    alt="Like icon"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmptyHeart from '@/assets/heart.svg'
import FilledHeart from '@/assets/heart_filled.svg'

const props = defineProps<{
  is_liked?: boolean
}>()

const liked = ref(props.is_liked ?? false)

const emit = defineEmits(['like_change'])

function toggleLike() {
  liked.value = !liked.value
  emit('like_change', liked.value)
}
</script>

<style scoped>
.play-icon,
.playing-icon {
  width: 22px;
  height: 22px;
  cursor: pointer;
  transition: transform 0.2s ease;
  position: relative;
  top: 1px;
}
.play-icon:active,
.playing-icon:active {
  transform: scale(0.85);
}
.hidden {
  display: none;
}

.track-info-wrapper {
  min-height: 40px; /* або більше, залежно від очікуваного розміру */
}

.track-info {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #c8c8c8;
  margin-top: 0.5rem;
  pointer-events: none;
}

.track-info.visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.35s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.track-link {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
}

.track-link:hover {
  opacity: 0.8;
  text-decoration: none;
}
</style>
