<template>
  <div class="profile" v-if="user">
    <!-- Header -->
    <section class="profile-header">
      <img v-if="avatarSrc" :src="avatarSrc" alt="Profile photo" class="avatar" />

      <div class="details">
        <h2 class="username">{{ user.username }}</h2>

        <ul class="stats">
          <li>
            <strong>{{ posts.length }}</strong> posts
          </li>
        </ul>

        <p class="description">{{ user.description }}</p>
      </div>
    </section>

    <!-- Post Gallery -->
    <section class="gallery">
      <router-link
        v-for="post in posts"
        :key="post.postId"
        :to="{ name: 'PostPage', params: { postId: post.postId } }"
      >
        <img class="post-img" :src="getThumbnail(post)" :alt="post.description" />
      </router-link>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getUserByID } from '@/services/auth'
import { searchPostsByUserID } from '@/services/search'
import { getPostsByIDs } from '@/services/posts'
import type { Post } from '@/models/Post'
import type { User } from '@/models/User'
import profileFallback from '@/assets/profile.svg'

const route = useRoute()
const userId = route.params.userId as string // 👈 path param like /profile/abc123

const user = ref<User>()
const posts = ref<Post[]>([])

const avatarSrc = computed(
  () =>
    user.value?.avatarUrl
      ? `${import.meta.env.VITE_IMAGE_BASE_PATH}${user.value.avatarUrl}`
      : profileFallback, // 👈 imported fallback
)

const getThumbnail = (post: Post) => {
  const thumb = post.images.find((i) => i.variantType === 'THUMBNAIL') ?? post.images[0]
  return `${import.meta.env.VITE_IMAGE_BASE_PATH}${thumb.url}`
}

onMounted(async () => {
  if (!userId) return

  user.value = await getUserByID(userId)

  const results = await searchPostsByUserID(userId, 50, 0)
  const ids = results.map((r) => r.postId)
  posts.value = await getPostsByIDs(ids)
})
</script>

<style scoped>
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

.description {
  font-size: 14px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.post-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
  border-radius: 0.5rem; /* ⬅️ Rounded corners */
  margin: 10px; /* ⬅️ Optional spacing between items */
}
</style>
