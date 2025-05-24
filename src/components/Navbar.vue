<template>
  <nav class="navbar">
    <div class="logo-wrapper">
      <InspireLogo />
    </div>
    <div class="search-wrapper">
      <SearchInput v-model="searchStore.searchQuery" />
    </div>
    <div class="nav-links">
      <a v-if="user" :href="`/users/${user.id}`">My Profile</a>
      <a v-if="!user" href="/login">Sign In</a>
      <a v-else href="/logout">Sign Out</a>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import InspireLogo from './Logo.vue'
import SearchInput from './SearchInput.vue'
import { useSearchStore } from '@/stores/useSearchStore'
import { getUserData } from '@/services/authCookies.js'
const searchStore = useSearchStore()
const user = getUserData()
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

.nav-links a:hover {
  color: white;
}
</style>
