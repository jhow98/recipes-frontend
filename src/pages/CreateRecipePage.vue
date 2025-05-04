<template>
  <AppHeader />
  <div class="create-page">
    <h2 class="create-page__title">Criar Receita</h2>
    <div class="create-page__form">
      <RecipeForm :model-value="recipe" submit-label="Criar" @submit="handleCreate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RecipeForm from '@/components/RecipeForm.vue'
import AppHeader from '@/components/AppHeader.vue'
import api from '@/services/api'

const router = useRouter()

const recipe = ref({
  name: '',
  preparation_time_minutes: 0,
  servings: 0,
  preparation_method: '',
  ingredients: '',
  categoryId: '',
})

const handleCreate = async (data: any) => {
  await api.post('/recipes', data)
  router.push('/receitas')
}
</script>

<style scoped>
.create-page {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.create-page__title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.create-page__form {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
