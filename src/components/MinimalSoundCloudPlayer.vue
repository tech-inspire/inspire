<template>
  <div class="track-info-wrapper">
    <div
      class="track-info"
      :class="{ visible: trackTitle && trackArtist, hidden: !(trackTitle && trackArtist) }"
    >
      <img
        :class="{ 'playing-icon': isPlaying }"
        class="play-icon"
        @click="togglePlayPause"
        :src="isPlaying ? StopIcon : PlayIcon"
        alt="Play/Stop icon"
      />
      <a :href="trackLink" target="_blank" rel="noopener noreferrer" class="track-link">
        <h4>
          <strong>{{ trackTitle }}</strong> by {{ trackArtist }}
        </h4>
      </a>
    </div>

    <SoundCloudPlayer
      ref="playerRef"
      class="hidden"
      :songUrl="songUrl"
      :startTime="startTime"
      :startVolume="30"
      :autoPlay="false"
      :volumeControl="true"
      @loaded="onLoaded"
      @playback-change="isPlaying = $event"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SoundCloudPlayer from '@/components/SoundCloudPlayer.vue'
import PlayIcon from '@/assets/play.svg'
import StopIcon from '@/assets/stop.svg'

const props = defineProps<{
  songUrl: string
  startTime?: number
}>()

const playerRef = ref()
const isPlaying = ref(false)
const trackTitle = ref('')
const trackArtist = ref('')
const trackLink = ref('') // 👈 new

function togglePlayPause() {
  playerRef.value?.playPause()
}

const emit = defineEmits(['error'])

function handleError(message: string) {
  emit('error', message)
}
function onLoaded(data: { title: string; artist: string; permalinkUrl: string }) {
  trackTitle.value = data.title
  trackArtist.value = data.artist
  trackLink.value = data.permalinkUrl
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
