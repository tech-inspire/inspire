import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserData } from '@/services/authCookies'
import type { User } from '@/models/User.ts'

export const useUserStore = defineStore('user', () => {
  const user = ref(getUserData())

  function setUser(u: User) {
    user.value = u
  }

  function clearUser() {
    user.value = null
  }

  return {
    user,
    setUser,
    clearUser,
  }
})
