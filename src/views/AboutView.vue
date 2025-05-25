<script lang="ts" setup>
import SoundCloudPlayer from '@/components/SoundCloudPlayer.vue'

const songURL = 'ivoxxxygen/acid-blue'
</script>

<template>
  <div class="about">
    <h1>Inspire. Stay tuned.</h1>
  </div>

  <SoundCloudPlayer :song-url="songURL" :start-time="28500" :auto-play="false" />
</template>

<style>
h1 {
  font-family: 'San Francisco';
  font-size: 50px;
}
</style>
