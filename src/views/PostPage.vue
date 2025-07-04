<template>
  <div class="layout" v-if="post && author">
    <!-- MAIN POST -->
    <transition name="fade-scale" appear>
      <article class="post">
        <header class="author">
          <router-link
            v-if="author.avatarUrl"
            :to="{ name: 'ProfilePage', params: { userId: author.id } }"
          >
            <img :src="avatarSrc" class="avatar" alt="avatar" />
          </router-link>

          <div class="author-info">
            <h2>{{ post.description }}</h2>

            <p>
              by
              <router-link
                :to="{ name: 'ProfilePage', params: { userId: author.id } }"
                class="username-link"
                >{{ author.username }}
              </router-link>
            </p>

            <section class="audio-wrapper" v-if="post.soundcloudSong">
              <MinimalSoundCloudPlayer
                :key="post.soundcloudSong"
                :songUrl="post.soundcloudSong"
                :startTime="post.soundcloudSongStart || 0"
              />
            </section>
          </div>
        </header>

        <transition name="fade">
          <img :alt="post.description" v-if="imageSrc" :src="imageSrc" class="post-img" />
        </transition>

        <section class="caption">
          <time :datetime="post.createdAt.toISOString()">
            Posted at {{ formatDate(post.createdAt) }} - Inspire Web
          </time>
          <div class="fl" v-if="post_likes !== undefined">
            <LikeButton
              :is_liked="liked_post ?? false"
              @like_change="onLike"
              class="like-icon"
            ></LikeButton>
            <transition name="like-fade" mode="out-in">
              <h4 :key="post_likes" style="color: var(--vt-c-text-dark-2)">
                {{ post_likes }} like{{ post_likes === 1 ? '' : 's' }}
              </h4>
            </transition>
          </div>
        </section>

        <div class="button-row">
          <button class="action-button" @click="goBack">× Close</button>
          <button class="action-button" @click="downloadImage">↓ Download</button>
          <button
            v-if="showDeleteModal"
            class="action-button"
            @click="showDeleteConfirmModal = true"
          >
            🗑 Delete
          </button>
        </div>
        <transition name="fade">
          <ConfirmModal
            v-if="showDeleteConfirmModal"
            title="Confirm Deletion"
            message="Are you sure you want to delete this post? This action cannot be undone."
            @confirm="handleDeletePost"
            @cancel="showDeleteConfirmModal = false"
          />
        </transition>
      </article>
    </transition>

    <!-- SIMILAR IMAGES -->
    <aside class="similar" v-if="similarPosts.length" @scroll="handleScroll">
      <h1 style="margin-bottom: 10px">More like this</h1>
      <div class="similar-grid">
        <router-link
          v-for="p in similarPosts"
          :key="p.postId"
          :to="{
            name: 'PostPage',
            params: { postId: p.postId },
            query: { ...route.query }, // keeps ?modal=1 if present
          }"
        >
          <transition name="fade" appear>
            <img :src="thumbSrc(p)" alt="similar image" class="similar-img" />
          </transition>
        </router-link>
      </div>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostByID, getPostsByIDs, deletePost } from '@/services/posts.ts'
import { searchPostsByPostID } from '@/services/search.ts'
import { getUserByID } from '@/services/auth.ts'
import type { Post } from '@/models/Post'
import type { User } from '@/models/User'
import MinimalSoundCloudPlayer from '@/components/MinimalSoundCloudPlayer.vue'
import { getMainImageSrc, getAvatarSrc, getThumbnailSrc as thumbSrc } from '@/utils/imagePaths'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useUserStore } from '@/stores/useUserStore.ts'
import { getPostLikesCount, hasUserLikedPost, likePost, unlikePost } from '@/services/likes.ts'
import LikeButton from '@/components/LikeButton.vue'

const page = ref(0)
const pageSize = 20

/* --- stores & router --- */
const route = useRoute()
const router = useRouter()

/* --- reactive state --- */
const post_likes = ref<number | undefined>(undefined)
const liked_post = ref<boolean>()
const post = ref<Post>()
const author = ref<User>()
const similarPosts = ref<Post[]>([])

const showDeleteModal = ref(false)
const showDeleteConfirmModal = ref(false)

/* --- helpers --- */
const mainImage = computed(
  () => post.value?.images.find((i) => i.variantType === 'ORIGINAL') ?? post.value?.images[0],
)

const imageSrc = computed(() => getMainImageSrc(mainImage.value))
const avatarSrc = computed(() => getAvatarSrc(author.value?.avatarUrl))

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

function goBack() {
  router.back()
}

function handleScroll(e: Event) {
  const el = e.target as HTMLElement
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 200

  if (nearBottom) {
    page.value++
    loadSimilarPosts()
  }
}

async function loadSimilarPosts(reset = false) {
  const id = route.params.postId as string
  const res = await searchPostsByPostID(id, pageSize, page.value * pageSize)
  const posts = await getPostsByIDs(res.map((r) => r.postId))
  let filtered = posts.filter((p) => p.postId !== id)
  if (filtered.length % 2 === 1) {
    filtered = filtered.slice(0, -1)
  }
  if (reset) {
    similarPosts.value = filtered
  } else {
    similarPosts.value.push(...filtered)
  }
}

/* --- load data --- */
onMounted(async () => {
  const id = route.params.postId as string

  post.value = await getPostByID(id)
  author.value = await getUserByID(post.value.authorId)
  showDeleteModal.value = post.value.authorId === userStore.user?.id

  try {
    const store = useUserStore()
    if (store.user?.id) {
      liked_post.value = await hasUserLikedPost(id, store.user?.id)
    }

    // get likes
    post_likes.value = Number(await getPostLikesCount(id))
  } catch (error) {
    console.log(error)
  }

  page.value = 0
  await loadSimilarPosts(true)
})

async function onLike(liked: boolean) {
  const id = route.params.postId as string

  if (liked) {
    await likePost(id)
  } else {
    await unlikePost(id)
  }
  if (post_likes.value !== undefined) {
    post_likes.value += liked ? 1 : -1
  }
}

const userStore = useUserStore()

// Watch for route changes (if user clicks another similar post)
watch(
  () => route.params.postId as string,
  async (newId) => {
    post.value = await getPostByID(newId)
    author.value = await getUserByID(post.value.authorId)

    showDeleteModal.value = post.value.authorId === userStore.user?.id

    const res = await searchPostsByPostID(newId as string, 20, 0)
    const posts = await getPostsByIDs(res.map((res) => res.postId))
    similarPosts.value = posts.filter((p: Post) => p.postId !== newId)
  },
)

function downloadImage() {
  if (!mainImage.value) return

  const link = document.createElement('a')
  link.href = imageSrc.value
  link.download = `inspire_${post.value?.postId}.jpg` // or .png depending on your format
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function handleDeletePost() {
  if (post.value) {
    await deletePost(post.value.postId)
  }

  router.push({ name: 'home' })
}
</script>

<style scoped>
/* --- layout ---------------------------------------------------------- */
.layout {
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1600px;
  margin-inline: auto;
}

.post {
  flex: 1 1 0;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* --- author header --------------------------------------------------- */
.author {
  display: flex;
  font-size: 1rem;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin: 1rem 0;
}

.avatar {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
}

/* --- post image ------------------------------------------------------ */
.post-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 0.5rem;
}

/* --- caption --------------------------------------------------------- */
.caption {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0.5rem;
}

.fl {
  display: flex;
  flex-direction: row;
}

.like-icon {
  margin-right: 0.5rem;
  margin-top: 5px;
}

/* --- close button ---------------------------------------------------- */
.action-button {
  margin-top: 1.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    background 0.2s ease;
}

.action-button:hover {
  background: rgba(255 255 255 / 0.9);
}

.action-button:active {
  transform: scale(0.97);
}

.action-button:disabled {
  opacity: 0.6;
  cursor: default;
}

/* --- similar rail ---------------------------------------------------- */
.similar {
  will-change: transform;
  width: 40%;
  max-height: 90vh;
  overflow-y: auto;
  padding-right: 0.5rem;

  /* Hide scrollbar for WebKit (Chrome, Safari) */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.similar::-webkit-scrollbar {
  display: none; /* WebKit */
}

.similar h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.similar-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 0.5rem;
  transition: transform 0.15s ease;
}

.similar-img:hover {
  transform: scale(1.04);
}

/* --- responsive ------------------------------------------------------ */
@media (max-width: 900px) {
  .layout {
    flex-direction: column;
    padding: 0 1rem;
  }

  .similar {
    width: 100%;
    order: 2;
  }

  .similar-grid {
    grid-template-columns: repeat(
      auto-fill,
      minmax(110px, 1fr)
    ); /* Already good for responsiveness */
  }
}

.audio-wrapper {
  margin-top: 1rem;
  width: 100%;
}

/* Fade + Scale for main post */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* Basic fade for similar images */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hidden {
  display: none;
}

.username-link {
  color: inherit;
  text-decoration: none;
}

.username-link:hover {
  text-decoration: none;
  opacity: 0.9;
  transition: opacity ease 0.3s;
}

.button-row {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center; /* optional: or use flex-end */
}

.button-row button {
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    background 0.2s ease;
}

.action-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.9);
  color: black;
}

.action-button:active {
  transform: scale(0.97);
}
</style>
