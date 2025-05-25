<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderNavbar from './components/HeaderNavbar.vue'
import Footer from './components/PageFooter.vue' // ← NEW
</script>

<template>
  <HeaderNavbar />

  <div class="router-view-container">
    <router-view v-slot="{ Component, route }">
      <component
        :is="Component"
        v-if="route.name === 'PostPage' && $route.query.modal === '1'"
        class="modal"
      >
        <Transition name="modal" />
      </component>
      <component :is="Component" v-else />
    </router-view>
  </div>

  <Footer />
  <!-- ← NEW -->
</template>

<style scoped>
/* space below so page content is not hidden behind the fixed footer */
.router-view-container {
  padding-top: 80px; /* navbar height */
  padding-bottom: 60px; /* footer height  */
}
</style>
