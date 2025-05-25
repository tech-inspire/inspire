<template>
  <div class="wrapper" @mouseenter="startTimer" @mouseleave="stopTimer" @click="redirectToHome">
    <div class="logo">
      <span class="text">in</span>
      <span class="dot" :class="{ blink: true }"></span>
      <span class="text">spire</span>
    </div>
    <HoverTimer :visible="isHovered" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HoverTimer from '@/components/HoverTimer.vue'
import { useSearchStore } from '@/stores/useSearchStore'

const isHovered = ref(false)
const router = useRouter()

function startTimer() {
  isHovered.value = true
}

function stopTimer() {
  isHovered.value = false
}

function redirectToHome() {
  const store = useSearchStore()
  store.searchQuery = ''
  router.push('/')
}
</script>

<style scoped>
.wrapper {
  position: relative;
  display: inline-block;
  //padding: 2rem;
  //background-color: black;
}

.logo {
  font-size: 3rem;
  font-weight: bold;
  font-family: 'Helvetica Neue', sans-serif;
  color: white;
  //display: flex;
  align-items: center;
  vertical-align: middle;
  cursor: pointer;
  margin-bottom: 0;
}

.text {
  color: white;
}

.dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin: 0 0.3rem;
  background-color: red;
  transition: opacity 0.4s ease-in-out;
  opacity: 1;
  border-radius: 50%;
}

.dot.blink {
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
}
</style>
