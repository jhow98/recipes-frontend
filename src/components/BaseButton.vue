<template>
  <button class="auth-button" :type="type">
    <slot />
  </button>
</template>

<script setup lang="ts">
// global defineProps
defineProps<{ type?: 'button' | 'submit' }>()
</script>

<style scoped>
.auth-button {
  background-color: #2c3e50;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
}
</style>
