<template>
  <div class="auth-input">
    <label :for="id">{{ label }}</label>
    <input :id="id" :type="type" :placeholder="placeholder" :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  id: string;
  type?: string;
  modelValue: string;
  placeholder?: string;
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
.auth-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 6px;
}
</style>