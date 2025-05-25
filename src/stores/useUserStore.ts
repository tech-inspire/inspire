import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserData } from '@/services/authCookies'

export const useUserStore = defineStore('user', () => {
  const user = ref(getUserData())

  function setUser(u: any) {
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
