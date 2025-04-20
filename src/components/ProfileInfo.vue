<template>
  <div class="profile-page">
    <!-- Left side: Gallery space -->
    <div class="gallery-section">
      <h2>Gallery</h2>
      <div class="gallery-placeholder">
        <!-- Placeholder for gallery content -->
        <p>Gallery content will go here</p>
      </div>
    </div>

    <!-- Right side: User info -->
    <div class="user-info-section">
      <h2>User Profile</h2>
      <div class="user-info-card">
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Joined: {{ user.joined }}</p>
        <p>Bio: {{ user.bio }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfilePage',
  data() {
    return {
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        joined: 'January 2023',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    }
  },
})
</script>

<style scoped>
.profile-page {
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  background-color: #f0f0f0;
}

.gallery-section {
  flex: 2;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gallery-placeholder {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border: 2px dashed #ccc;
  border-radius: 6px;
  color: #666;
}

.user-info-section {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-info-card {
  padding: 20px;
  background-color: #f9f9f9;
  font-family: 'Merchant Copy', monospace;
  color: #111;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: left;
  position: relative;
  overflow: hidden;
}

@font-face {
  font-family: 'Merchant Copy Doublesize';
  src: url('/merchant-copy/merchant-copy-doublesize.ttf');
}

.user-info-card p {
  font-family: 'Merchant Copy Doublesize';
  font-size: 1rem;
  color: #111;
  margin: 10px 0;
}

h2 {
  font-family: sans-serif;
  color: #333;
  margin-bottom: 15px;
}
</style>
