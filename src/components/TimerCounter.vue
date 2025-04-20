<template>
  <div class="timer">
    {{ formattedTime }}
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const time = ref(0)
let intervalId = null

const formattedTime = computed(() => {
  const totalMilliseconds = time.value
  const milliseconds = String(totalMilliseconds % 1000)
    .padStart(2, '0')
    .slice(0, 2)
  const totalSeconds = Math.floor(totalMilliseconds / 1000)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  return `${minutes}:${seconds}:${milliseconds}`
})

onMounted(() => {
  intervalId = setInterval(() => {
    time.value += 10
  }, 10)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.timer {
  font-size: 6rem;
  background-color: #000;
  padding: 1rem 2rem;
  border-radius: 5px;
  color: #ccc;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>
