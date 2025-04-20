<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { test } from '../services/api'

await test()
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
