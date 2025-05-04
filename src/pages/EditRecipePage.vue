<template>
  <AppHeader />
  <div class="edit-page__wrapper">
    <h2 class="edit-page__title">Editar Receita</h2>

    <div v-if="fetchError" class="edit-page__error">
      {{ fetchError }}
      <router-link to="/receitas" class="edit-page__link">Voltar para minhas receitas</router-link>
    </div>
    <div v-else class="edit-page__form-container">
      <RecipeForm
        :model-value="recipe"
        submit-label="Salvar"
        @submit="handleSubmit"
        class="edit-page__form"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import api from '@/services/api'
import RecipeForm from '@/components/RecipeForm.vue'

const route = useRoute()
const router = useRouter()

const recipe = ref({
  name: '',
  preparation_time_minutes: 0,
  servings: 0,
  preparation_method: '',
  ingredients: '',
  categoryId: '',
})

const fetchError = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get(`/recipes/${route.params.id}`)
    recipe.value = {
      name: data.name,
      preparation_time_minutes: data.preparation_time_minutes,
      servings: data.servings,
      preparation_method: data.preparation_method,
      ingredients: data.ingredients,
      categoryId: data.category?.id || '',
    }
  } catch (e: any) {
    if (e.response?.status === 404) {
      fetchError.value = 'Receita não encontrada.'
    } else {
      fetchError.value = 'Erro ao carregar a receita. Tente novamente mais tarde.'
    }
  }
})

const handleSubmit = async (updatedData: any) => {
  await api.put(`/recipes/${route.params.id}`, updatedData)
  router.push('/receitas')
}
</script>

<style scoped>
.edit-page__wrapper {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.edit-page__title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.edit-page__error {
  font-size: 1rem;
  color: #d9534f;
  text-align: center;
  margin-top: 2rem;
}

.edit-page__link {
  display: inline-block;
  margin-top: 1rem;
  color: #007bff;
  text-decoration: none;
}

.edit-page__link:hover {
  text-decoration: underline;
}

.edit-page__form-container {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-page__form {
  margin-top: 1rem;
}
</style>
