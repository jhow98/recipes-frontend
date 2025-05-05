<template>
  <div>
    <AppHeader />
    <div class="recipes-page">
      <h2 class="recipes-page__title">Suas receitas</h2>

      <div class="recipes-page__search-bar">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nome da receita…"
          class="recipes-page__search-input"
        />
      </div>

      <div v-if="loading" class="recipes-page__info">Carregando receitas…</div>
      <div v-else-if="error" class="recipes-page__error">{{ error }}</div>
      <div v-else-if="filteredRecipes.length === 0" class="recipes-page__info">
        Nenhuma receita encontrada.
        <router-link to="/receitas/criar" class="recipes-page__link">
          Crie uma nova receita </router-link
        >.
      </div>
      <table v-else class="recipes-page__table">
        <thead class="recipes-page__thead">
          <tr class="recipes-page__row">
            <th class="recipes-page__th">Nome</th>
            <th class="recipes-page__th">Tempo de Preparo (min)</th>
            <th class="recipes-page__th">Porções</th>
            <th class="recipes-page__th">Ações</th>
          </tr>
        </thead>
        <tbody class="recipes-page__tbody">
          <tr v-for="recipe in filteredRecipes" :key="recipe.id" class="recipes-page__row">
            <td class="recipes-page__cell">{{ recipe.name }}</td>
            <td class="recipes-page__cell">{{ recipe.preparation_time_minutes }}</td>
            <td class="recipes-page__cell">{{ recipe.servings }}</td>
            <td class="recipes-page__cell recipes-page__actions">
              <button
                class="recipes-page__button"
                @click="viewRecipe(recipe.id)"
                title="Visualizar"
              >
                <Eye :size="18" />
              </button>
              <button class="recipes-page__button" @click="editRecipe(recipe.id)" title="Editar">
                <Pencil :size="18" />
              </button>
              <button
                class="recipes-page__button"
                @click="confirmDelete(recipe.id)"
                title="Excluir"
              >
                <Trash2 :size="18" />
              </button>
              <button
                class="recipes-page__button"
                @click="printRecipe(recipe.id, recipe.name)"
                :disabled="printLoading"
                title="Imprimir"
              >
                <Printer :size="18" />
              </button>
              <p v-if="printError" class="recipes-page__error">{{ printError }}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <ConfirmDeleteModal v-if="showModal" @confirm="deleteRecipe" @cancel="showModal = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import AppHeader from '@/components/AppHeader.vue'
import { Eye, Pencil, Trash2, Printer } from 'lucide-vue-next'
import { useFetch } from '@/composables/useFetch'
import { usePrintRecipe } from '@/composables/usePrintRecipe'
import api from '@/services/api'

interface Recipe {
  id: number
  name: string
  preparation_time_minutes: number
  servings: number
}

const searchTerm = ref('')

const { data: recipes, loading, error, reload } = useFetch<Recipe[]>('/recipes')
const { loading: printLoading, error: printError, printRecipe } = usePrintRecipe()
const showModal = ref(false)
const recipeIdToDelete = ref<number | null>(null)
const router = useRouter()

const filteredRecipes = computed(() => {
  if (!searchTerm.value) return recipes.value || []
  return (recipes.value || []).filter(r =>
    r.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const viewRecipe = (id: number) => {
  router.push(`/receitas/${id}`)
}

const editRecipe = (id: number) => {
  router.push(`/receitas/${id}/editar`)
}

const confirmDelete = (id: number) => {
  recipeIdToDelete.value = id
  showModal.value = true
}

const deleteRecipe = async () => {
  if (!recipeIdToDelete.value) return
  await await api.delete(`/recipes/${recipeIdToDelete.value}`)
  showModal.value = false
  recipeIdToDelete.value = null
  reload()
}
</script>

<style scoped>
.recipes-page {
  padding: 2rem;
}

.recipes-page__search-bar {
  margin-bottom: 1rem;
}

.recipes-page__search-input {
  width: 300px;
  max-width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.recipes-page__table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.recipes-page__th,
.recipes-page__cell {
  border: 1px solid #ddd;
  padding: 0.8rem;
}

.recipes-page__th {
  background-color: #f4f4f4;
  text-align: left;
}

.recipes-page__actions {
  display: flex;
  gap: 0.5rem;
}

.recipes-page__button {
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: 0.2s ease;
}

.recipes-page__button:hover {
  background: #f0f0f0;
}

.recipes-page__info {
  font-size: 0.875rem;
  color: #555;
  margin-top: 1rem;
}

.recipes-page__error {
  color: #d9534f;
  font-size: 0.875rem;
  margin-top: 1rem;
}
</style>
