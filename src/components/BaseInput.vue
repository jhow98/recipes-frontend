<template>
  <div class="base-input">
    <label :for="id" class="base-input__label">{{ label }}</label>
    <input
      class="base-input__control"
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  id: string
  type?: string
  modelValue: string
  placeholder?: string
}>()

defineEmits(['update:modelValue'])
</script>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.base-input__label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.base-input__control {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin: 0;
  font-size: 1rem;
}

.base-input__control:focus {
  outline: none;
  border-color: #2c3e50;
  box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.2);
}
</style>
