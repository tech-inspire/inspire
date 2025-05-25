<template>
  <div class="auth-page">
    <BackgroundPosts />
    <Transition name="fade-slide" appear>
      <form v-if="!submitting" class="auth-card" @submit.prevent="handleCreatePost">
        <h1>Create Post</h1>

        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="Preview" class="preview-img" />
        </div>

        <label>
          <span>Image</span>
          <input
            type="file"
            class="input-field"
            accept="image/*"
            @change="handleFileChange"
            required
          />
        </label>

        <label>
          <span>Description</span>
          <textarea
            v-model="form.description"
            class="input-field"
            placeholder="Say something inspiring..."
            rows="3"
            required
          ></textarea>
        </label>

        <div v-if="form.songUrl" class="soundcloud-preview">
          <MinimalSoundCloudPlayer
            :key="form.songStartTimeSeconds"
            :songUrl="extractSoundCloudPath(form.songUrl)"
            :startTime="form.songStartTimeSeconds * 1000"
            @error="soundcloudError = $event"
          />
        </div>

        <button type="submit" class="primary-btn" :disabled="submitting || !form.file">
          {{ submitting ? 'Creating Post…' : 'Create Post' }}
        </button>

        <label>
          <span class="small-label">(Optional) SoundCloud Track</span>
          <input
            type="url"
            class="input-field small-label"
            v-model="form.songUrl"
            placeholder="Paste SoundCloud track URL"
          />
        </label>

        <div v-if="form.songUrl" class="soundcloud-preview">
          <label>
            <span class="small-label">Start Time (seconds)</span>
            <input
              type="number"
              class="input-field small-label"
              v-model.number="form.songStartTimeSeconds"
              min="0"
              step="0.1"
            />
          </label>
        </div>

        <p v-if="soundcloudError" class="error-msg">{{ soundcloudError }}</p>
      </form>
    </Transition>

    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getUploadUrl, addPost } from '@/services/posts'
import '@/styles/form-base.css'
const router = useRouter()
import { compressImage } from '@/utils/imageCompression.ts'
import BackgroundPosts from '@/components/BackgroundPosts.vue'
import MinimalSoundCloudPlayer from '@/components/MinimalSoundCloudPlayer.vue'

function extractSoundCloudPath(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('soundcloud.com')) {
      const parts = parsed.pathname.split('/').filter(Boolean)
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`
      }
    }
  } catch (e) {
    return null
  }
  return null
}

const form = reactive({
  description: '',
  file: null as File | null,
  songUrl: '',
  songStartTimeSeconds: 0,
})

const imagePreview = ref<string | null>(null)
const submitting = ref(false)
const error = ref<string | null>(null)

const soundcloudError = ref<string | null>(null)
watch(
  () => form.songUrl,
  () => {
    soundcloudError.value = null
  },
)

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
    const file = target.files[0]
    form.file = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function handleCreatePost() {
  if (!form.file) return

  submitting.value = true
  error.value = null

  try {
    const { blob, width, height } = await compressImage(form.file)
    const imageData = await blob.arrayBuffer()
    const mimeType = blob.type
    const fileSize = blob.size

    const uploadMeta = await getUploadUrl(mimeType, fileSize)

    // Upload to signed URL
    const uploadResponse = await fetch(uploadMeta.uploadUrl, {
      method: uploadMeta.method,
      headers: uploadMeta.headers,
      body: imageData,
    })

    if (!uploadResponse.ok) {
      const body = await uploadResponse.text()
      throw new Error(`Image upload failed: ${uploadResponse.status} - ${body}`)
    }

    const post = await addPost({
      uploadSessionKey: uploadMeta.uploadSessionKey,
      imageWidth: width,
      imageHeight: height,
      imageSize: fileSize,
      description: form.description,
      soundcloudSong: extractSoundCloudPath(form.songUrl) || null,
      soundcloudSongStart: form.songStartTimeSeconds * 1000 || 0,
    })

    await router.push(`/posts/${post.postId}`)
  } catch (e: any) {
    error.value = e?.message || 'Post creation failed.'
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
:global(.fade-slide-enter-active),
:global(.fade-slide-leave-active) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.fade-slide-enter-from),
:global(.fade-slide-leave-to) {
  opacity: 0;
  transform: translateY(10px);
}

.small-label {
  font-size: 1.1rem;
}

.image-preview {
  margin-top: 1rem;
  text-align: center;

  img.preview-img {
    max-width: 100%;
    border-radius: 8px;
    object-fit: contain;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  }
}
</style>
