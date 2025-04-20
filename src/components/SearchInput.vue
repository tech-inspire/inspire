<template>
  <input
    class="search"
    type="text"
    placeholder="Search..."
    v-model="modelValue"
    @input="$emit('update:modelValue', modelValue)"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: String,
})

const modelValue = ref(props.modelValue ?? '')

watch(
  () => props.modelValue,
  (val) => {
    modelValue.value = val
  },
)
</script>

<style scoped>
.search {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  padding: 0.45rem 1rem;
  border-radius: 10px;
  font-size: 1rem;
  color: #fff;
  width: 50%;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.05);
}

.search::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search:focus {
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.08);
}
</style>
