<template>
  <div class="profile">
    <!-- ─────────────── HEADER (Avatar + Stats) ─────────────── -->
    <section class="profile-header">
      <img :src="user.photo" alt="Profile photo" class="avatar" />

      <div class="details">
        <h2 class="username">{{ user.name }}</h2>

        <ul class="stats">
          <li>
            <strong>{{ user.posts }}</strong> posts
          </li>
          <li>
            <strong>{{ user.followers }}</strong> followers
          </li>
          <li>
            <strong>{{ user.following }}</strong> following
          </li>
        </ul>

        <p class="bio">{{ user.bio }}</p>
      </div>
    </section>

    <!-- ─────────────── POST GRID (simple placeholders) ─────────────── -->
    <section class="gallery">
      <!-- Replace with real post images later -->
      <div v-for="n in user.posts" :key="n" class="square"></div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfilePage',
  data() {
    return {
      user: {
        name: '@illiadymura',
        joined: '2025-17-04',
        bio: 'Вова їбаш їх блять',
        photo: '/profile-example.jpg',
        followers: 14,
        following: 88,
        posts: 5,
      },
    }
  },
})
</script>

<style scoped>
/* ─────────────── LAYOUT ─────────────── */
.profile {
  max-width: 935px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'San Francisco';
}

.profile-header {
  display: flex;
  gap: 40px;
  align-items: center;
  margin-bottom: 40px;
}

/* ─────────────── AVATAR & STATS ─────────────── */
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 28px;
  font-weight: 300;
}

.stats {
  display: flex;
  gap: 30px;
  list-style: none;
  padding: 0;
  margin: 20px 0;
  font-size: 16px;
}

.stats li strong {
  font-weight: 600;
}

.bio {
  font-size: 14px;
}

/* ─────────────── GALLERY GRID ─────────────── */
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1px;
}

.square {
  width: 100%;
  padding-bottom: 100%; /* Creates 1:1 */
  background: #efefef;
}
</style>
