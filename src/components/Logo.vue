<template>
  <div class="wrapper" @mouseenter="startTimer" @mouseleave="stopTimer">
    <div class="logo">
      <span class="text">in</span>
      <span class="dot" :class="{ blink: true }"></span>
      <span class="text">spire</span>
    </div>
    <div class="timer" :class="{ show: isHovered }">
      {{ formattedTime }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const time = ref(0)
let intervalId = null
const isHovered = ref(false)

const formattedTime = computed(() => {
  const milliseconds = String(time.value % 1000)
    .padStart(3, '0')
    .slice(0, 2)
  const totalSeconds = Math.floor(time.value / 1000)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  return `${minutes}:${seconds}:${milliseconds}`
})

function startTimer() {
  isHovered.value = true
  if (!intervalId) {
    intervalId = setInterval(() => {
      time.value += 10
    }, 10)
  }
}

function stopTimer() {
  isHovered.value = false
  clearInterval(intervalId)
  intervalId = null
  // time.value = 0 // Reset if needed
}

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
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
