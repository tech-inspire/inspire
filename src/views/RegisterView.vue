<template>
  <div class="auth-page">
    <Transition name="fade-slide" appear>
      <form v-if="!submitting" class="auth-card" @submit.prevent="handleRegister">
        <h1>Create account</h1>

        <label>
          <span>Name</span>
          <input
            v-model="form.name"
            class="input-field"
            autocomplete="name"
            required
            placeholder="John Doe"
          />
        </label>

        <label>
          <span>Username</span>
          <input
            v-model="form.username"
            class="input-field"
            autocomplete="username"
            required
            placeholder="johndoe"
          />
        </label>

        <label>
          <span>Email</span>
          <input
            v-model="form.email"
            type="email"
            class="input-field"
            autocomplete="email"
            required
            placeholder="johndoe@inspire.tech"
          />
        </label>

        <label>
          <span>Password</span>
          <input
            v-model="form.password"
            type="password"
            class="input-field"
            autocomplete="new-password"
            required
            placeholder="..."
          />
        </label>

        <button type="submit" class="primary-btn" :disabled="submitting">
          {{ submitting ? 'Creating account…' : 'Create account' }}
        </button>

        <RouterLink to="/login" class="switch-link">Already registered? Sign in</RouterLink>
      </form>
    </Transition>

    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register as registerSvc } from '@/services/auth'
import '@/styles/auth-base.css'

const router = useRouter()

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
})
const submitting = ref(false)
const error = ref<string | null>(null)

async function handleRegister() {
  submitting.value = true
  error.value = null
  try {
    const res = await registerSvc(form)
    if (res.type === 'success') {
      await router.push('/')
    } else {
      await router.push({ name: 'confirm-email', query: { email: form.email } })
    }
  } catch (e) {
    error.value = e?.message ?? 'Registration failed'
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
