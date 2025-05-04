<template>
  <form @submit.prevent="handleSubmit" novalidate>
    <BaseInput
      id="name"
      label="Nome da Receita"
      type="text"
      v-model="form.name"
      placeholder="Ex: Arroz Carreteiro"
    />
    <p v-if="errors.name" class="error">
      {{ errors.name }}
    </p>

    <div class="two-columns">
      <div class="col">
        <BaseInput
          id="preparation_time_minutes"
          label="Tempo de preparo (min)"
          type="number"
          v-model.number="form.preparation_time_minutes"
          placeholder="Ex: 30"
        />
        <p v-if="errors.preparation_time_minutes" class="error">
          {{ errors.preparation_time_minutes }}
        </p>
      </div>
      <div class="col">
        <BaseInput
          id="servings"
          label="Porções"
          type="number"
          v-model.number="form.servings"
          placeholder="Ex: 4"
        />
        <p v-if="errors.servings" class="error">
          {{ errors.servings }}
        </p>
      </div>
    </div>

    <BaseInput
      id="ingredients"
      label="Ingredientes"
      type="text"
      v-model="form.ingredients"
      placeholder="Ex: arroz, carne, temperos"
    />
    <p v-if="errors.ingredients" class="error">
      {{ errors.ingredients }}
    </p>

    <div class="textarea-wrapper">
      <label for="preparation_method">Modo de preparo</label>
      <textarea
        id="preparation_method"
        v-model="form.preparation_method"
        placeholder="Descreva o modo de preparo"
        rows="6"
      />
    </div>
    <p v-if="errors.preparation_method" class="error">
      {{ errors.preparation_method }}
    </p>

    <select v-model.number="form.categoryId" class="select-input">
      <option value="">Selecione uma categoria</option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
        {{ cat.name }}
      </option>
    </select>
    <p v-if="errors.categoryId" class="error">
      {{ errors.categoryId }}
    </p>

    <BaseButton type="submit">
      {{ submitLabel }}
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import api from '@/services/api'

const props = defineProps<{
  modelValue: any
  submitLabel?: string
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const form = ref({ ...props.modelValue })
const errors = ref<Record<string, string>>({})

const categories = ref<{ id: number; name: string }[]>([])
async function fetchCategories() {
  const { data } = await api.get('/categories')
  categories.value = data
}
onMounted(fetchCategories)

watch(
  () => props.modelValue,
  v => {
    form.value = { ...v }
    errors.value = {}
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
  emit('submit', { ...form.value })
}
</script>

<style scoped>
.two-columns {
  display: flex;
  gap: 1rem;
}

.col {
  flex: 1;
}

.textarea-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.textarea-wrapper textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  margin-top: 0.5rem;
}

.error {
  color: #d9534f;
  font-size: 0.875rem;
}

.select-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 1rem;
  width: 100%;
}
</style>
