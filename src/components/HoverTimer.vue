<!-- components/HoverTimer.vue -->
<template>
  <div class="timer" :class="{ show: isVisible }">
    {{ formattedTime }}
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  visible: Boolean,
})

const isVisible = computed(() => props.visible)

const time = ref(0)
let intervalId = null

const formattedTime = computed(() => {
  const milliseconds = String(time.value % 1000)
    .padStart(3, '0')
    .slice(0, 2)
  const totalSeconds = Math.floor(time.value / 1000)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  return `${minutes}:${seconds}:${milliseconds}`
})

watch(isVisible, (val) => {
  if (val) {
    if (!intervalId) {
      intervalId = setInterval(() => {
        time.value += 10
      }, 10)
    }
  } else {
    clearInterval(intervalId)
    intervalId = null
  }
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.timer {
  position: absolute;
  transform: translate(0, -40px);
  font-size: 1.2rem;
  font-family: 'San Francisco', monospace;
  color: #c8c8c8;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.5s,
    transform 0.5s;
}

.timer.show {
  opacity: 1;
  transform: translate(0, -20px);
  pointer-events: auto;
}
</style>
