<template>
  <AppHeader />
  <div class="page-wrapper">
    <h2>Criar Receita</h2>
    <RecipeForm :model-value="recipe" submit-label="Criar" @submit="handleCreate" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RecipeForm from '@/components/RecipeForm.vue';
import AppHeader from '@/components/AppHeader.vue';
import api from '@/services/api';

const router = useRouter();

const recipe = ref({
  name: '',
  preparation_time_minutes: 0,
  servings: 0,
  preparation_method: '',
  ingredients: '',
  categoryId: ''
});

const handleCreate = async (data: any) => {
  await api.post('/recipes', data);
  router.push('/receitas');
};
</script>

<style scoped>
.page-wrapper {
  padding: 2rem;
  max-width: 600px;
  margin: auto;
}
</style>