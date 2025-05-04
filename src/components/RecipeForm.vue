<template>
  <form @submit.prevent="handleSubmit" novalidate class="recipe-form">
    <BaseInput
      id="name"
      label="Nome da Receita"
      type="text"
      v-model="form.name"
      placeholder="Ex: Arroz Carreteiro"
      class="recipe-form__input"
    />
    <p v-if="errors.name" class="recipe-form__error">{{ errors.name }}</p>

    <div class="recipe-form__two-columns">
      <div class="recipe-form__col">
        <BaseInput
          id="preparation_time_minutes"
          label="Tempo de preparo (min)"
          type="number"
          v-model.number="form.preparation_time_minutes"
          placeholder="Ex: 30"
          class="recipe-form__input"
        />
        <p v-if="errors.preparation_time_minutes" class="recipe-form__error">
          {{ errors.preparation_time_minutes }}
        </p>
      </div>
      <div class="recipe-form__col">
        <BaseInput
          id="servings"
          label="Porções"
          type="number"
          v-model.number="form.servings"
          placeholder="Ex: 4"
          class="recipe-form__input"
        />
        <p v-if="errors.servings" class="recipe-form__error">{{ errors.servings }}</p>
      </div>
    </div>

    <BaseInput
      id="ingredients"
      label="Ingredientes"
      type="text"
      v-model="form.ingredients"
      placeholder="Ex: arroz, carne, temperos... Dica: separe por vírgula"
      class="recipe-form__input"
    />
    <p v-if="errors.ingredients" class="recipe-form__error">{{ errors.ingredients }}</p>

    <div class="recipe-form__textarea-wrapper">
      <label for="preparation_method" class="recipe-form__textarea-label">Modo de preparo</label>
      <textarea
        id="preparation_method"
        v-model="form.preparation_method"
        placeholder="Descreva o modo de preparo"
        rows="6"
        class="recipe-form__textarea"
      />
    </div>
    <p v-if="errors.preparation_method" class="recipe-form__error">
      {{ errors.preparation_method }}
    </p>

    <div class="recipe-form__select-wrapper">
      <select
        v-if="!catLoading"
        v-model.number="form.categoryId"
        class="recipe-form__select-input"
        :disabled="catLoading"
      >
        <option value="">Selecione uma categoria</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <p v-if="catLoading" class="recipe-form__info">Carregando categorias…</p>
      <p v-if="catError" class="recipe-form__error">{{ catError }}</p>
    </div>
    <p v-if="errors.categoryId" class="recipe-form__error">{{ errors.categoryId }}</p>

    <BaseButton v-if="!submitting" type="submit" class="recipe-form__button">
      {{ submitLabel }}
    </BaseButton>
    <div v-else class="recipe-form__loading">Criando receita...</div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useCategories } from '@/composables/useCategories'

const props = defineProps<{
  modelValue: any
  submitLabel?: string
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const form = ref({ ...props.modelValue })
const errors = ref<Record<string, string>>({})
const submitting = ref(false)

const { categories, loading: catLoading, error: catError } = useCategories()

watch(
  () => props.modelValue,
  v => {
    form.value = { ...v }
    errors.value = {}
    submitting.value = false
  }
)

function validate() {
  errors.value = {}
  if (!form.value.name?.trim()) {
    errors.value.name = 'O nome é obrigatório.'
  }
  if (form.value.preparation_time_minutes == null || form.value.preparation_time_minutes < 1) {
    errors.value.preparation_time_minutes = 'O tempo de preparo deve ser de no mínimo 1 minuto.'
  }
  if (form.value.servings == null || form.value.servings < 1) {
    errors.value.servings = 'Deve ter pelo menos 1 porção.'
  }
  if (!form.value.ingredients?.trim()) {
    errors.value.ingredients = 'Informe os ingredientes.'
  }
  if (!form.value.preparation_method?.trim()) {
    errors.value.preparation_method = 'Descreva o modo de preparo.'
  }
  if (!form.value.categoryId) {
    errors.value.categoryId = 'Selecione uma categoria.'
  }
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  emit('submit', { ...form.value })
}
</script>

<style scoped>
.recipe-form {
  display: flex;
  flex-direction: column;
}

.recipe-form__two-columns {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.recipe-form__col {
  flex: 1;
}

.recipe-form__input {
  margin-bottom: 0.5rem;
}

.recipe-form__textarea-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.recipe-form__textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  margin-top: 0.5rem;
}

.recipe-form__select-wrapper {
  margin-bottom: 1rem;
}

.recipe-form__select-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
}

.recipe-form__info {
  font-size: 0.875rem;
  color: #555;
  margin-top: 0.25rem;
}

.recipe-form__error {
  color: #d9534f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.recipe-form__button {
  align-self: flex-start;
  margin-top: 1rem;
}

.recipe-form__loading {
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  color: #555;
  margin-top: 1rem;
}
</style>
