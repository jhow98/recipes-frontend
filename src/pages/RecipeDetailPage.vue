<template>
  <div>
    <AppHeader />
    <div class="page-wrapper">
      <div v-if="fetchError" class="info">{{ fetchError }}</div>
      <div v-else class="detail-card">
        <h2>{{ recipe.name }}</h2>
        <p><strong>Autor:</strong> {{ recipe.author }}</p>
        <p><strong>Tempo de preparo:</strong> {{ recipe.preparation_time_minutes }} min</p>
        <p><strong>Porções:</strong> {{ recipe.servings }}</p>
        <p><strong>Ingredientes:</strong></p>
        <ul>
          <li v-for="ing in ingredientsList" :key="ing">
            {{ ing }}
          </li>
        </ul>
        <p class="method">
          <strong>Modo de preparo:</strong><br />
          {{ recipe.preparation_method }}
        </p>

        <div class="detail-card__actions">
          <button
            v-if="isOwner"
            @click="edit"
            class="detail-card__button detail-card__button--edit"
          >
            Editar
          </button>
          <button
            v-if="isOwner"
            @click="confirmDelete"
            class="detail-card__button detail-card__button--delete"
          >
            Excluir
          </button>
          <button
            @click="printRecipe(recipe.id, recipe.name)"
            :disabled="printLoading"
            class="detail-card__button detail-card__button--print"
          >
            Imprimir
          </button>
          <p v-if="printError" class="error">{{ printError }}</p>
        </div>
      </div>
    </div>
    <ConfirmDeleteModal v-if="showModal" @confirm="remove" @cancel="showModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue'
import api from '@/services/api'
import { usePrintRecipe } from '@/composables/usePrintRecipe'
import { useAuthStore } from '@/store/auth'

interface Recipe {
  id: number
  name: string
  preparation_time_minutes: number
  servings: number
  preparation_method: string
  ingredients: string
  userId: number
  categoryId: number
  author: string
}

const { loading: printLoading, error: printError, printRecipe } = usePrintRecipe()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const recipe = ref<Recipe>({
  id: 0,
  name: '',
  preparation_time_minutes: 0,
  servings: 0,
  preparation_method: '',
  ingredients: '',
  userId: 0,
  categoryId: 0,
  author: '',
})
const showModal = ref(false)
const fetchError = ref('')

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    const res = await api.get<Recipe>(`/recipes/${id}`)
    recipe.value = res.data
  } catch (e: any) {
    if (e.response?.status === 404) {
      fetchError.value = 'Receita não existe.'
    } else {
      fetchError.value = 'Erro ao carregar a receita. Tente novamente mais tarde.'
    }
  }
})

const ingredientsList = computed(() => recipe.value.ingredients.split(',').map(s => s.trim()))
const isOwner = computed(() => recipe.value.userId === auth.userId)

function edit() {
  router.push(`/receitas/${recipe.value.id}/editar`)
}
function confirmDelete() {
  showModal.value = true
}
async function remove() {
  await api.delete(`/recipes/${recipe.value.id}`)
  router.push('/receitas')
}
</script>

<style scoped>
.page-wrapper {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.detail-card {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.detail-card__title {
  margin-bottom: 1rem;
}

.detail-card__list {
  list-style: disc;
  margin-left: 1.5rem;
}

.detail-card__method {
  white-space: pre-wrap;
  margin-top: 1rem;
}

.detail-card__actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.5rem;
}

.detail-card__button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.detail-card__button:hover {
  opacity: 0.9;
}

.detail-card__button--edit {
  background: #f0ad4e;
  color: #fff;
}

.detail-card__button--delete {
  background: #d9534f;
  color: #fff;
}

.detail-card__button--print {
  background: #5bc0de;
  color: #fff;
}

.page-wrapper__info {
  font-size: 1rem;
  color: #555;
}

.page-wrapper__error {
  color: #d9534f;
}
</style>
