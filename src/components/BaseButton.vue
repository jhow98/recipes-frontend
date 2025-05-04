<template>
  <button
    class="base-button"
    :class="{ 'base-button--disabled': disabled }"
    :type="type"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ type?: 'button' | 'submit'; disabled?: boolean }>()
</script>

<style scoped>
.base-button {
  background-color: #2c3e50;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.base-button--disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
