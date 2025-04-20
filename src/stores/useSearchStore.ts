// stores/useSearchStore.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('')

  return { searchQuery }
})
