<template>
  <form @submit.prevent="handleSubmit">
    <BaseInput
      id="name"
      label="Nome da Receita"
      type="text"
      v-model="form.name"
      placeholder="Ex: Arroz Carreteiro"
      required
    />

    <BaseInput
      id="preparation_time_minutes"
      label="Tempo de preparo (minutos)"
      type="number"
      v-model.number="form.preparation_time_minutes"
      placeholder="Ex: 30"
      required
    />

    <BaseInput
      id="servings"
      label="Porções"
      type="number"
      v-model.number="form.servings"
      placeholder="Ex: 4"
      required
    />

    <BaseInput
      id="ingredients"
      label="Ingredientes"
      type="text"
      v-model="form.ingredients"
      placeholder="Ex: arroz, carne, temperos"
      required
    />

    <BaseInput
      id="preparation_method"
      label="Modo de preparo"
      type="text"
      v-model="form.preparation_method"
      placeholder="Descreva o modo de preparo"
      required
    />

    <select v-model="form.categoryId" required class="select-input">
      <option value="">
        Selecione uma categoria
      </option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
        {{ cat.name }}
      </option>
    </select>

    <BaseButton type="submit">
      {{ submitLabel }}
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineEmits } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import api from '@/services/api';

const props = defineProps<{
    modelValue: any; // Partial<RecipeDto> - com name, servings, etc
    submitLabel?: string;
}>();

const emit = defineEmits(['update:modelValue', 'submit']);

const form = ref({ ...props.modelValue });
const categories = ref<{ id: number; name: string }[]>([]);

watch(() => props.modelValue, (newValue) => {
    form.value = { ...newValue };
});

const handleSubmit = () => {
    emit('submit', { ...form.value });
};

const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    categories.value = data;
};

onMounted(fetchCategories);
</script>

<style scoped>
.select-input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-bottom: 1rem;
    width: 100%;
}
</style>