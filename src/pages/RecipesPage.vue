<template>
  <div>
    <AppHeader />
    <div class="page-wrapper">
      <h2>Suas receitas</h2>

      <table class="recipe-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tempo de Preparo (min)</th>
            <th>Porções</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="recipe in recipes" :key="recipe.id">
            <td>{{ recipe.name }}</td>
            <td>{{ recipe.preparation_time_minutes }}</td>
            <td>{{ recipe.servings }}</td>
            <td class="actions">
              <button @click="viewRecipe(recipe.id)" title="Visualizar">
                <Eye :size="18" />
              </button>
              <button @click="editRecipe(recipe.id)" title="Editar">
                <Pencil :size="18" />
              </button>
              <button @click="confirmDelete(recipe.id)" title="Excluir">
                <Trash2 :size="18" />
              </button>
              <button @click="printRecipe(recipe.id, recipe.name)" title="Imprimir">
                <Printer :size="18" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <ConfirmDeleteModal v-if="showModal" @confirm="deleteRecipe" @cancel="showModal = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal.vue';
import AppHeader from '@/components/AppHeader.vue';
import api from '@/services/api';
import { Eye, Pencil, Trash2, Printer } from 'lucide-vue-next';

interface Recipe {
  id: number;
  name: string;
  preparation_time_minutes: number;
  servings: number;
}

const recipes = ref<Recipe[]>([]);

const showModal = ref(false);
const recipeIdToDelete = ref<number | null>(null);
const router = useRouter();

const fetchRecipes = async () => {
  const { data } = await api.get<Recipe[]>('/recipes');
  recipes.value = data;
};

onMounted(fetchRecipes);

const viewRecipe = (id: number) => {
  router.push(`/receitas/${id}`)
}

const editRecipe = (id: number) => router.push(`/receitas/${id}/editar`);

const confirmDelete = (id: number) => {
  recipeIdToDelete.value = id;
  showModal.value = true;
};

const deleteRecipe = async () => {
  if (!recipeIdToDelete.value) return;
  await api.delete(`/recipes/${recipeIdToDelete.value}`);
  showModal.value = false;
  recipeIdToDelete.value = null;
  await fetchRecipes();
};

const printRecipe = async (id: number, name: string) => {
  const response = await api.get(`/recipes/${id}/print`, {
    responseType: 'blob',
  });
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `receita-${name}.pdf`;
  link.click();
};
</script>

<style scoped>
.page-wrapper {
  padding: 2rem;
}

.recipe-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.recipe-table th,
.recipe-table td {
  border: 1px solid #ddd;
  padding: 0.8rem;
}

.recipe-table th {
  background-color: #f4f4f4;
  text-align: left;
}

.actions button {
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px;
  margin-right: 6px;
  cursor: pointer;
  transition: 0.2s ease;
}

.actions button:hover {
  background: #f0f0f0;
}
</style>
