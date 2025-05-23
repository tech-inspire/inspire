<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { test } from '../services/api'
import { getPostByID } from '@/services/posts'

const post = await getPostByID('0196fd61-2184-7af9-b6ca-f83e715aa0a8')
console.dir(post)
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
