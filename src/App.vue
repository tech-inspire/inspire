<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/PageFooter.vue' // ← NEW
</script>

<template>
  <Navbar />

  <div class="router-view-container">
    <RouterView />
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
