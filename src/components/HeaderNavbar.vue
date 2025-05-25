<template>
  <nav class="navbar">
    <div class="logo-wrapper">
      <InspireLogo />
    </div>
    <div class="search-wrapper">
      <SearchInput v-model="searchStore.searchQuery" @enter="onEnterSearch" />
    </div>
    <div class="nav-links">
      <a v-if="user" :href="`/users/${user.id}`">My Profile</a>
      <a v-if="!user" href="/login">Sign In</a>
      <button v-else @click="doLogout" class="nav-link-button">Sign Out</button>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import InspireLogo from './InspireLogo.vue'
import SearchInput from './SearchInput.vue'
import { useSearchStore } from '@/stores/useSearchStore'
import { useUserStore } from '@/stores/useUserStore'
import { logout } from '@/services/auth.js'

const searchStore = useSearchStore()
const userStore = useUserStore()
const user = computed(() => userStore.user)

import { useRouter } from 'vue-router'

const router = useRouter()

function onEnterSearch() {
  if (searchStore.searchQuery.trim()) {
    router.push({ path: '/search', query: { q: searchStore.searchQuery } })
  }
}

function doLogout() {
  logout()
  userStore.clearUser()
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  z-index: 10;
  margin-bottom: 5px;
}

.logo-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
}

.search-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.nav-links a {
  color: #ccc;
  text-decoration: none;
  margin-left: 2rem;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.nav-link-button {
  background: none;
  border: none;
  color: #ccc;
  margin-left: 2rem;
  font-size: 1.2rem;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
  padding: 0;
}

.nav-link-button:hover {
  color: white;
}

.nav-links a:hover {
  color: white;
}
</style>
