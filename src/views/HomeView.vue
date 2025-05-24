<script setup lang="ts">
import { onMounted, type Ref, ref } from 'vue'
import { getUserData } from '@/services/authCookies.ts'
import type { User } from '@/models/User.ts'

let user: Ref<User | null> = ref(null)

onMounted(() => {
  user.value = getUserData()
  console.log(user)
})
</script>

<template>
  <main>
    <h1>Hello, {{ user?.name || 'Guest' }}</h1>
  </main>
</template>
