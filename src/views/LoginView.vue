<template>
  <div class="auth-page">
    <BackgroundPosts></BackgroundPosts>
    <Transition name="fade-slide" appear>
      <form v-if="!submitting" class="auth-card" @submit.prevent="handleLogin">
        <h1>Welcome back</h1>

        <label>
          <span>Username or Email</span>
          <input
            v-model="credentials.login"
            class="input-field"
            autocomplete="username"
            required
            placeholder="inspire.tech"
          />
        </label>

        <label>
          <span>Password</span>
          <input
            v-model="credentials.password"
            type="password"
            class="input-field"
            autocomplete="current-password"
            required
            placeholder="..."
          />
        </label>

        <button type="submit" class="primary-btn" :disabled="submitting">
          {{ submitting ? 'Signing in…' : 'Continue' }}
        </button>

        <RouterLink to="/register" class="switch-link">New here? Create an account</RouterLink>
      </form>
    </Transition>

    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login as loginSvc } from '@/services/auth'
import '@/styles/form-base.css'
import BackgroundPosts from '@/components/BackgroundPosts.vue'

const router = useRouter()

const credentials = reactive({
  login: '',
  password: '',
})
const submitting = ref(false)
const error = ref<string | null>(null)

async function handleLogin() {
  submitting.value = true
  error.value = null
  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.login)

    const loginPayload = isEmail ? { email: credentials.login } : { username: credentials.login }

    await loginSvc(loginPayload, credentials.password)

    await router.push('/')
  } catch (e) {
    error.value = error.value = e instanceof Error ? e.message : String(e)
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
</style>
