<template>
  <div class="auth-page text-center">
    <Transition name="fade-slide" appear>
      <form class="auth-card confirm-wrap" @submit.prevent="submit">
        <h1>Enter confirmation code</h1>
        <p>
          We emailed a 6‑digit code to <strong>{{ email }}</strong
          >. Paste it below to activate your account.
        </p>

        <input
          v-model="code"
          class="input-field code-input"
          maxlength="6"
          required
          autocomplete="one-time-code"
        />

        <button type="submit" class="primary-btn" :disabled="submitting || code.length !== 6">
          {{ submitting ? 'Verifying…' : 'Confirm email' }}
        </button>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <RouterLink to="/login" class="switch-link mt">Return to sign in</RouterLink>
      </form>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { confirmEmail as confirmEmailSvc } from '@/services/auth'
import '@/styles/auth-base.css'

const route = useRoute()
const router = useRouter()

const email = computed(() => (route.query.email ?? '') as string)
const code = ref('')
const submitting = ref(false)
const error = ref<string | null>(null)

async function submit() {
  submitting.value = true
  error.value = null
  try {
    await confirmEmailSvc(email.value, code.value)
    await router.push('/')
  } catch (e) {
    error.value = e?.message ?? 'Invalid code'
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
